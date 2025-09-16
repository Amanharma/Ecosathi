import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const complaints = pgTable("complaints", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  complaintNumber: text("complaint_number").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  priority: text("priority").notNull(), // CRITICAL, MEDIUM, LOW
  status: text("status").notNull(), // URGENT, ACTIVE, PENDING, RESOLVED
  department: text("department").notNull(),
  location: text("location").notNull(),
  assignedTo: text("assigned_to"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const departments = pgTable("departments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  activeCases: integer("active_cases").default(0),
  capacity: integer("capacity").default(100),
  activeTeams: integer("active_teams").default(1),
  avgResponseHours: real("avg_response_hours").default(0),
});

export const aiMetrics = pgTable("ai_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  totalComplaints: integer("total_complaints").default(0),
  aiAssignmentRate: real("ai_assignment_rate").default(0),
  avgResponseHours: real("avg_response_hours").default(0),
  resolutionRate: real("resolution_rate").default(0),
  predictionAccuracy: real("prediction_accuracy").default(0),
  autoAssignmentRate: real("auto_assignment_rate").default(0),
  processingSpeedSeconds: real("processing_speed_seconds").default(0),
  criticalDetected: integer("critical_detected").default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const blockchainMetrics = pgTable("blockchain_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  blockHeight: integer("block_height").default(0),
  verifiedRecords: real("verified_records").default(0),
  smartContracts: integer("smart_contracts").default(0),
  gasUsed: real("gas_used").default(0),
  networkActive: boolean("network_active").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const aiControlSettings = pgTable("ai_control_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  manualOverride: boolean("manual_override").default(false),
  autoAssignment: boolean("auto_assignment").default(true),
  aiTraining: boolean("ai_training").default(false),
  lastModelUpdate: timestamp("last_model_update").defaultNow(),
  accuracy: real("accuracy").default(0),
  processedComplaints: integer("processed_complaints").default(0),
});

// Insert schemas
export const insertComplaintSchema = createInsertSchema(complaints).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDepartmentSchema = createInsertSchema(departments).omit({
  id: true,
});

export const insertAiMetricsSchema = createInsertSchema(aiMetrics).omit({
  id: true,
  updatedAt: true,
});

export const insertBlockchainMetricsSchema = createInsertSchema(blockchainMetrics).omit({
  id: true,
  updatedAt: true,
});

export const insertAiControlSettingsSchema = createInsertSchema(aiControlSettings).omit({
  id: true,
  lastModelUpdate: true,
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertComplaint = z.infer<typeof insertComplaintSchema>;
export type Complaint = typeof complaints.$inferSelect;
export type InsertDepartment = z.infer<typeof insertDepartmentSchema>;
export type Department = typeof departments.$inferSelect;
export type InsertAiMetrics = z.infer<typeof insertAiMetricsSchema>;
export type AiMetrics = typeof aiMetrics.$inferSelect;
export type InsertBlockchainMetrics = z.infer<typeof insertBlockchainMetricsSchema>;
export type BlockchainMetrics = typeof blockchainMetrics.$inferSelect;
export type InsertAiControlSettings = z.infer<typeof insertAiControlSettingsSchema>;
export type AiControlSettings = typeof aiControlSettings.$inferSelect;
