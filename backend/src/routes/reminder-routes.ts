import { Router } from "express";
import { verifyToken } from "../utils/token-manager.js";
import {
  createReminder,
  getReminders,
  deleteReminder,
} from "../controllers/reminder-controllers.js";
import { reminderValidator, validate } from "../utils/validators.js";

const reminderRoutes = Router();

reminderRoutes.post("/create", validate(reminderValidator), verifyToken, createReminder);
reminderRoutes.get("/all", verifyToken, getReminders);
reminderRoutes.delete("/delete", verifyToken, deleteReminder);

export default reminderRoutes;
