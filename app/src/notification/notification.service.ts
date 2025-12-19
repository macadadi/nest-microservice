import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseService } from '@app/common';
import * as nodemailer from 'nodemailer';
import type { SentMessageInfo } from 'nodemailer/lib/smtp-transport';
import { generateEmailTemplate } from './templates/email.template';

@Injectable()
export class NotificationService extends BaseService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    super(NotificationService.name);
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

  async sendNotification(
    notification: string,
    options: {
      to: string;
      subject: string;
      html?: string;
      title?: string;
    },
  ): Promise<void> {
    const mailFrom = this.configService.getOrThrow<string>('MAIL_FROM');
    const to = options.to;
    const subject = options.subject;
    const html = generateEmailTemplate({
      content: notification,
      title: options.title,
    });

    try {
      const info = (await this.transporter.sendMail({
        from: mailFrom,
        to,
        subject,
        html,
        text: notification, // Plain text fallback
      })) as SentMessageInfo;

      this.logInfo('Email sent successfully', {
        messageId: info.messageId || 'unknown',
        to,
        subject,
      });
    } catch (error: unknown) {
      this.logError('Failed to send email', error);
      this.logInfo('Email send failure context', {
        to,
        subject,
      });
      throw error;
    }
  }
}
