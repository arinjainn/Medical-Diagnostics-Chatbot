import mongoose from "mongoose";
import { randomUUID } from "crypto";

const reminderSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  datetime: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  reminded: {
    type: Boolean,
    default: false,
  },
});

const chatSchema = new mongoose.Schema({
  id: {
    type: String,
    default: randomUUID(),
  },
  role: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: String,
  },
  gender: {
    type: String,
  },
  contactNumber: {
    type: String,
  },
  address: {
    type: String,
  },
  bloodType: {
    type: String,
  },
  allergies: {
    type: String,
  },
  medications: {
    type: String,
  },
  emergencyContact: {
    type: String,
  },
  chats: [chatSchema],
  reminders: [reminderSchema], //Add reminders
});

export default mongoose.model("User", userSchema);
