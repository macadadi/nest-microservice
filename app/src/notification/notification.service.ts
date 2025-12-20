import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { BaseService } from '@app/common';
import { EmailJobData } from './processors/email.processor';

@Injectable()
export class NotificationService extends BaseService {
  constructor(
    @InjectQueue('email') private readonly emailQueue: Queue<EmailJobData>,
  ) {
    super(NotificationService.name);
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
    const jobData: EmailJobData = {
      to: options.to,
      subject: options.subject,
      notification,
      title: options.title,
    };

    try {
      const job = await this.emailQueue.add('send-email', jobData, {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: {
          age: 3600, // Keep completed jobs for 1 hour
          count: 1000, // Keep max 1000 completed jobs
        },
        removeOnFail: {
          age: 86400, // Keep failed jobs for 24 hours
        },
      });

      this.logInfo('Email job added to Redis queue', {
        jobId: job.id,
        to: options.to,
        subject: options.subject,
      });
    } catch (error: unknown) {
      this.logError('Failed to add email job to Redis queue', error);
      this.logInfo('Email queue failure context', {
        to: options.to,
        subject: options.subject,
      });
      throw error;
    }
  }
}
