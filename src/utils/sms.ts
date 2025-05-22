import * as dotenv from 'dotenv';
dotenv.config();

const WHATSAPP_API = process.env.WHATSAPP_API!;
const WHATSAPP_APP_KEY = process.env.WHATSAPP_APP_KEY!;
const WHATSAPP_AUTH_KEY = process.env.WHATSAPP_AUTH_KEY!;

// const SMS_API = process.env.SMS_API!;
// const SMS_API_ID = process.env.SMS_API_ID!;
// const SMS_API_HASH = process.env.SMS_API_HASH!;
// const SMS_API_TYPE = process.env.SMS_API_TYPE!;
// const SENDER_NAME = process.env.SENDER_NAME!;

// // Optional: Validate required environment variables
// if (
//   !WHATSAPP_API || !WHATSAPP_APP_KEY || !WHATSAPP_AUTH_KEY ||
//   !SMS_API || !SMS_API_ID || !SMS_API_HASH || !SMS_API_TYPE || !SENDER_NAME
// ) {
//   throw new Error('One or more required environment variables are missing.');
// }

export const sendWhatsapp = async (
  phoneNumber: string,
  message: string,
  fileUrl?: string
): Promise<any> => {
  const url = WHATSAPP_API;
  const formData = new FormData();

  formData.append('appkey', WHATSAPP_APP_KEY);
  formData.append('authkey', WHATSAPP_AUTH_KEY);
  formData.append('to',phoneNumber);
  formData.append('message', message);

  if (fileUrl) {
    formData.append('file', fileUrl); // send as URL, not file object
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    throw error;
  }
};

// export const sendSmsOTP = async (phoneNumber: string, message: string) => {
//   const url = SMS_API;
//   const params = new URLSearchParams({
//     api_id: SMS_API_ID,
//     api_password: SMS_API_HASH,
//     sms_type: SMS_API_TYPE,
//     sms_encoding: 'Unicode',
//     sender: SENDER_NAME,
//     number: `91${phoneNumber}`,
//     message: message,
//   });

//   try {
//     const response = await fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//       body: params,
//     });

//     const data = await response.text();
//     console.log(`SMS sent to mobile Number: ${phoneNumber}`, data);
//     if (data.includes('success') || data.includes('OK')) {
//       return { success: true, message: 'OTP sent successfully', data };
//     } else {
//       throw new Error(`Failed to send OTP to ${phoneNumber}`);
//     }
//   } catch (error) {
//     console.error('Error sending OTP:', error);
//     throw new Error(`Failed to send OTP to ${phoneNumber}`);
//   }
// };
