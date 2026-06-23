import twilio from "twilio";
import { config } from "dotenv";
config(); // Load environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
let client = null;
if (accountSid && authToken) {
    try {
        client = twilio(accountSid, authToken);
    }
    catch (error) {
        console.error("Failed to initialize Twilio client:", error);
    }
}
else {
    console.log("Twilio credentials not found. SMS notification services will be disabled.");
}
export const sendSMS = async (to, body) => {
    if (!client) {
        console.log(`[SMS Simulation] To: +91${to} | Content: ${body}`);
        return;
    }
    try {
        const msg = await client.messages.create({
            body,
            from: twilioPhoneNumber,
            to: `+91${to}`,
        });
        console.log("SMS sent:", msg);
    }
    catch (error) {
        console.error("Failed to send SMS:", error);
    }
};
//# sourceMappingURL=twilio.js.map