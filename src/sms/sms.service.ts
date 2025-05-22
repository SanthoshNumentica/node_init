import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { sendWhatsapp } from '../utils/sms';
import { generateOtp } from 'src/utils/generateOtp';
import { getExpiry } from 'src/utils/dateTimeUtility';
const TWO_MINUTES = 2;
const TEST_OTP = '1234';
const AZURE_STOARGE = process.env.AZURE_STOARGE;
@Injectable()
export class SmsService {
  constructor(private readonly prisma: PrismaService) {}
  private get isProduction(): boolean {
    return process.env.ENVIRONMENT === 'production';
  }
  private get otpValue(): string {
    return this.isProduction ? generateOtp(4) : TEST_OTP;
  }

  async create(user: {
    countryCode: string;
    phoneNumber: bigint;
    isWhatsappOTP: boolean;
  }) {
    const otp = this.otpValue;

    try {
      if (this.isProduction) {
        const results = await Promise.allSettled([
          this.sendWhatsappOtp(user.countryCode, user.phoneNumber, otp),
        ]);

        const anySuccess = results.some(
          (result) => result.status === 'fulfilled',
        );

        if (!anySuccess) {
          throw new Error('Failed to send OTP via both WhatsApp and SMS');
        }
      }
      await this.prisma.otp.upsert({
        where: { phone_number: user.phoneNumber },
        update: {
          otp,
          expire_on: getExpiry(TWO_MINUTES),
        },
        create: {
          otp,
          phone_number: user.phoneNumber,
          expire_on: getExpiry(TWO_MINUTES),
        },
      });
    } catch (error) {
      console.error('Error creating OTP:', error);
      throw new Error('Failed to create OTP. Please try again.');
    }
  }
  private async sendWhatsappOtp(
    countryCode: string,
    phoneNumber: bigint,
    otp: string,
  ) {
    try {
      const fullNumber = `${countryCode.replace(/^\+/, '')}${phoneNumber.toString()}`;
      await sendWhatsapp(
        fullNumber,
        `${otp} is your one-time password [OTP] to login into Teledoctor.life`,
      );
    } catch (error) {
      console.error('Error sending WhatsApp OTP:', error);
    }
  }

  public async send(phoneNumber: string, attachment: string, message: string) {
    try {
      const file = attachment;
      await sendWhatsapp(phoneNumber, message, file);
      Logger.log(`OTP Sent to Whatsapp Mobile Number: ${phoneNumber}`);
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
    }
  }
}
