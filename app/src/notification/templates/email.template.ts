/**
 * Email template generator
 * Creates a fancy HTML email template with logo, date, and timestamp
 */

export interface EmailTemplateData {
  content: string;
  title?: string;
  timestamp?: string;
}

/**
 * Generates the SVG logo for Sleepr
 */
function generateLogo(): string {
  return `
    <svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r="55" fill="url(#logoGradient)" />
      <path d="M 40 50 L 40 70 L 50 70 L 50 60 L 60 60 L 60 50 Z" fill="white" opacity="0.9"/>
      <path d="M 70 50 L 70 70 L 80 70 L 80 50 Z" fill="white" opacity="0.9"/>
      <circle cx="50" cy="45" r="8" fill="white" opacity="0.9"/>
      <circle cx="75" cy="45" r="8" fill="white" opacity="0.9"/>
      <path d="M 45 75 Q 60 85 75 75" stroke="white" stroke-width="3" fill="none" opacity="0.9" stroke-linecap="round"/>
    </svg>
  `;
}

/**
 * Formats the current date and time
 */
export function formatTimestamp(): string {
  const now = new Date();
  const date = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const time = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
  return `${date} at ${time}`;
}

/**
 * Generates a fancy HTML email template
 * @param data - Email template data (content, title, optional timestamp)
 * @returns Complete HTML email template
 */
export function generateEmailTemplate(data: EmailTemplateData): string {
  const { content, title = 'Sleepr Notification' } = data;
  const timestamp = data.timestamp || formatTimestamp();
  const logo = generateLogo();

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 20px;
      min-height: 100vh;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      overflow: hidden;
    }
    .email-header {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      padding: 40px 30px;
      text-align: center;
    }
    .logo-container {
      display: inline-block;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      padding: 20px;
      margin-bottom: 20px;
      backdrop-filter: blur(10px);
    }
    .logo-container svg {
      display: block;
    }
    .email-title {
      color: #ffffff;
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 10px;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
    .timestamp {
      color: rgba(255, 255, 255, 0.9);
      font-size: 14px;
      font-weight: 400;
      letter-spacing: 0.5px;
    }
    .email-body {
      padding: 40px 30px;
      color: #333333;
      line-height: 1.8;
    }
    .content {
      font-size: 16px;
      color: #4a5568;
      margin-bottom: 30px;
    }
    .divider {
      height: 2px;
      background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
      margin: 30px 0;
    }
    .email-footer {
      background: #f7fafc;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e2e8f0;
    }
    .footer-text {
      color: #718096;
      font-size: 13px;
      line-height: 1.6;
    }
    .footer-text strong {
      color: #4a5568;
    }
    .badge {
      display: inline-block;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      margin-top: 10px;
      letter-spacing: 0.5px;
    }
    @media only screen and (max-width: 600px) {
      .email-container {
        border-radius: 0;
      }
      .email-header,
      .email-body,
      .email-footer {
        padding: 30px 20px;
      }
      .email-title {
        font-size: 24px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <div class="logo-container">
        ${logo}
      </div>
      <h1 class="email-title">${title}</h1>
      <div class="timestamp">${timestamp}</div>
    </div>
    <div class="email-body">
      <div class="content">
        ${content}
      </div>
      <div class="divider"></div>
    </div>
    <div class="email-footer">
      <div class="footer-text">
        <strong>Sleepr</strong><br>
        Your trusted accommodation platform<br>
        <span class="badge">Automated Email</span>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}
