import { createServer } from "http";
import { app } from "./app";
import { initializeSocket } from "./socket/socket.handler";
import dotenv from "dotenv";

dotenv.config();

const httpServer = createServer(app);
initializeSocket(httpServer);

const PORT = 9000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
