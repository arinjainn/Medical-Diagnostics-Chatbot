import { Router } from "express";
import userRoutes from "./user-routes.js";
import chatRoutes from "./chat-routes.js";
import reminderRoutes from "./reminder-routes.js";
const appRouter = Router();
appRouter.use("/user", userRoutes); //domain/api/v1/user
appRouter.use("/chat", chatRoutes); //domain/api/v1/chats
appRouter.use("/reminder", reminderRoutes); //domain/api/v1/reminder
export default appRouter;
//# sourceMappingURL=index.js.map