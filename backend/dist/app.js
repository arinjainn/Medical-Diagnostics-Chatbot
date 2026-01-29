import express from "express";
import { config } from "dotenv";
import morgan from "morgan"; //this will give some log discription that what type of request was handled and what was the response and what was the status code
import appRouter from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import "./utils/scheduler.js"; // Add this line to import the scheduler
config();
const app = express();
//middlewares
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
//remove it in production
app.use(morgan("dev"));
app.use("/api/v1", appRouter);
export default app;
// Purpose of Middleware: Middleware functions are crucial in Express applications for several reasons:
// Request Processing: They can process requests before sending responses, such as parsing request bodies, handling cookies, or logging.
// Response Handling: Middleware can modify responses before they are sent to the client, for example, setting response headers.
// Control Flow: They control the flow of request handling in an application by deciding whether to pass control to the next middleware or end the response.
// Reusability: Middleware can be modular and reused across different parts of the application.
//# sourceMappingURL=app.js.map