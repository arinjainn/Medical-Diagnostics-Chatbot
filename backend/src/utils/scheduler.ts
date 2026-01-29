import cron from "node-cron";
import User from "../models/User.js";
import { sendSMS } from "./twilio.js";

const checkReminders = async () => {
  const now = new Date();
  const users = await User.find({
    reminders: {
      $elemMatch: {
        datetime: { $lte: now },
      },
    },
  });

  users.forEach((user) => {
    user.reminders.forEach((reminder) => {
        console.log("hello");
      if (new Date(reminder.datetime) <= now && !reminder.reminded) {
        console.log("time to remind");
        const message = `Reminder: ${reminder.title} - ${reminder.description}`;
        if(user.contactNumber)
            sendSMS(user.contactNumber, message);
        // Optionally remove or update the reminder
        user.reminders.id(reminder._id).reminded = true;
      }
    });
    user.save();
  });
};

// Schedule the task to run every minute
cron.schedule("* * * * *", checkReminders);
