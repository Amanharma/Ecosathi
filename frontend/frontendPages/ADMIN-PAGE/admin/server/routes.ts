import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAiControlSettingsSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard data endpoints
  app.get("/api/dashboard/metrics", async (req, res) => {
    try {
      const aiMetrics = await storage.getAiMetrics();
      res.json(aiMetrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch AI metrics" });
    }
  });

  app.get("/api/dashboard/blockchain", async (req, res) => {
    try {
      const blockchainMetrics = await storage.getBlockchainMetrics();
      res.json(blockchainMetrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blockchain metrics" });
    }
  });

  app.get("/api/dashboard/ai-control", async (req, res) => {
    try {
      const aiControlSettings = await storage.getAiControlSettings();
      res.json(aiControlSettings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch AI control settings" });
    }
  });

  app.post("/api/dashboard/ai-control", async (req, res) => {
    try {
      const settings = insertAiControlSettingsSchema.parse(req.body);
      const updated = await storage.updateAiControlSettings(settings);
      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid settings data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update AI control settings" });
      }
    }
  });

  app.get("/api/complaints", async (req, res) => {
    try {
      const complaints = await storage.getAllComplaints();
      res.json(complaints);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch complaints" });
    }
  });

  app.get("/api/departments", async (req, res) => {
    try {
      const departments = await storage.getAllDepartments();
      res.json(departments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch departments" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
