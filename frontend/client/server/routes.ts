// frontend/client/server/routes.ts
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import authRoutes from "./auth"; // Import our auth routes
import cors from "cors";

export async function registerRoutes(app: Express): Promise<Server> {
  // Add CORS middleware
  app.use(cors({
    origin: ["http://localhost:5000", "http://localhost:5173"],
    credentials: true,
  }));

  // Health check route
  app.get("/", (req, res) => {
    res.send("🚀 Ecosathi Full-Stack App is running...");
  });

  // Auth routes - integrate your backend auth routes here
  app.use("/api/auth", authRoutes);

  // Your existing application routes can go here
  // prefix all routes with /api
  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);
  return httpServer;
}