import { Injectable, ServiceUnavailableException } from '@nestjs/common';

type ParsgreenOtpResponse = {
  R_Success?: boolean;
  R_Error?: string;
  R_Message?: string;
};

/** Server-only client for ParsGreen's REST v2 OTP endpoint. */
@Injectable()
export class ParsgreenSmsService {
  async sendLoginCode(phone: string, code: string) {
    const apiKey = process.env.PARSGREEN_API_KEY?.trim();
    if (!apiKey) {
      throw new ServiceUnavailableException('سرویس پیامک هنوز تنظیم نشده است');
    }

    const baseUrl = (
      process.env.PARSGREEN_BASE_URL || 'https://sms.parsgreen.ir/Apiv2'
    ).replace(/\/$/, '');
    const templateId = Number(process.env.PARSGREEN_OTP_TEMPLATE_ID || 0);
    const addName = process.env.PARSGREEN_OTP_ADD_NAME !== 'false';

    let response: Response;
    try {
      response = await fetch(`${baseUrl}/Message/SendOtp`, {
        method: 'POST',
        headers: {
          Authorization: `basic apikey:${apiKey}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          Mobile: phone,
          SmsCode: code,
          TemplateId: Number.isFinite(templateId) ? templateId : 0,
          AddName: addName,
        }),
        signal: AbortSignal.timeout(12_000),
      });
    } catch {
      throw new ServiceUnavailableException('ارتباط با پنل پیامک برقرار نشد');
    }

    const payload = (await response
      .json()
      .catch(() => ({}))) as ParsgreenOtpResponse;
    if (!response.ok || payload.R_Success !== true) {
      throw new ServiceUnavailableException(
        payload.R_Error || payload.R_Message || 'ارسال پیامک ناموفق بود',
      );
    }
  }
}
