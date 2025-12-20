import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { SentMessageInfo } from 'nodemailer/lib/smtp-transport';
import { generateEmailTemplate } from '../templates/email.template';

export interface EmailJobData {
  to: string;
  subject: string;
  notification: string;
  title?: string;
}

@Processor('email')
@Injectable()
export class EmailProcessor extends WorkerHost {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(private readonly configService: ConfigService) {
    super();
    this.initializeTransporter();
  }

  private initializeTransporter(): void {
    const mailHost = this.configService.getOrThrow<string>('MAIL_HOST');
    const mailPort = this.configService.getOrThrow<number>('MAIL_PORT');

    this.transporter = nodemailer.createTransport({
      host: mailHost,
      port: mailPort,
      secure: false, // MailHog doesn't use TLS
      ignoreTLS: true, // Ignore TLS for MailHog
      // No auth property - MailHog doesn't require authentication
    });
  }

  async process(job: Job<EmailJobData>): Promise<SentMessageInfo> {
    const { to, subject, notification, title } = job.data;
    const mailFrom = this.configService.getOrThrow<string>('MAIL_FROM');

    const html = generateEmailTemplate({
      content: notification,
      title: title,
    });

    try {
      const info = (await this.transporter.sendMail({
        from: mailFrom,
        to,
        subject,
        html,
        text: notification, // Plain text fallback
      })) as SentMessageInfo;

      this.logger.log('Email sent successfully', {
        messageId: info.messageId || 'unknown',
        to,
        subject,
        jobId: job.id,
      });

      return info;
    } catch (error: unknown) {
      this.logger.error('Failed to send email', error);
      this.logger.log('Email send failure context', {
        to,
        subject,
        jobId: job.id,
      });
      throw error;
    }
  }
}
