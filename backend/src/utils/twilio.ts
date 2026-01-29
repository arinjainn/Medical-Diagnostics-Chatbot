import twilio from "twilio";
import { config } from "dotenv";

config(); // Load environment variables

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// console.log(accountSid, authToken, twilioPhoneNumber);
// console.log("hello");
const client = twilio(accountSid, authToken);

export const sendSMS = async (to, body) => {

  try {
    const msg = await client.messages.create({
      body,
      from: twilioPhoneNumber,
      to: `+91${to}`,
    });
    console.log("SMS sent:", msg);
  } catch (error) {
    console.error("Failed to send SMS:", error);
  }
};
