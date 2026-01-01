import { Server } from "socket.io";
import { FleetService } from "../services/fleet.service";

// Singleton pattern for io instance
let io: Server;

export const initializeSocket = (httpServer: any) => {
  io = new Server(httpServer, {
    cors: {
      origin:
        process.env.NODE_ENV === "production"
          ? [process.env.FRONTEND_URL || "https://fleet-ui-1i84.onrender.com"]
          : ["http://localhost:5173"],
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", async (socket) => {
    console.log("Client Connected:", socket.id);

    const stats = await FleetService.getStats();
    socket.emit("stats_update", stats);

    socket.on("ticket_created", (msg: string) => {
      console.log("Ticket received from client:", msg);

      // Broadcast admin response simulation
      setTimeout(() => {
        io.emit("admin_message", {
          id: Date.now().toString(),
          message: `Admin: Received ticket - "${msg}"`,
          timestamp: new Date().toISOString(),
        });
      }, 2000);
    });

    socket.on("disconnect", () => {
      console.log("Client Disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized. Call initializeSocket first.");
  }

  return io;
};
