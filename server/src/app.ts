import express from "express";
import cors from "cors";
import { routes } from "./routes";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "https://fleet-ui-li84.onrender.com",
  })
);
app.use(express.json());
app.use("/api", routes);

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal Server Error" });
  }
);

export { app };
