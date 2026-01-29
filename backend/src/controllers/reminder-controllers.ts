import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
// import { Reminder } from "../models/Reminder.js"; // Assuming you have a separate Reminder model

// Create a new reminder
export const createReminder = async (req: Request, res: Response, next: NextFunction) => {
  const { title, datetime, description } = req.body;

  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).json({ message: "User not registered OR Token malfunctioned" });
    }

    user.reminders.push({ title, datetime, description });
    await user.save();

    return res.status(201).json({ message: "Reminder created successfully", reminders: user.reminders });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// Fetch all reminders
export const getReminders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }

    return res.status(200).json({ message: "OK", reminders: user.reminders });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// Delete a reminder
export const deleteReminder = async (req: Request, res: Response, next: NextFunction) => {
  const { reminderId } = req.body;

  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    //@ts-ignore
    user.reminders = user.reminders.filter(reminder => reminder._id.toString() !== reminderId);
    // user.reminders = [];
    await user.save();

    return res.status(200).json({ message: "Reminder deleted successfully", reminders: user.reminders });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
