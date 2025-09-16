import { 
  type User, 
  type InsertUser, 
  type Complaint, 
  type InsertComplaint,
  type Department,
  type InsertDepartment,
  type AiMetrics,
  type InsertAiMetrics,
  type BlockchainMetrics,
  type InsertBlockchainMetrics,
  type AiControlSettings,
  type InsertAiControlSettings
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Complaint operations
  getAllComplaints(): Promise<Complaint[]>;
  getComplaint(id: string): Promise<Complaint | undefined>;
  createComplaint(complaint: InsertComplaint): Promise<Complaint>;
  updateComplaint(id: string, complaint: Partial<InsertComplaint>): Promise<Complaint | undefined>;
  
  // Department operations
  getAllDepartments(): Promise<Department[]>;
  getDepartment(id: string): Promise<Department | undefined>;
  updateDepartment(id: string, department: Partial<InsertDepartment>): Promise<Department | undefined>;
  
  // AI Metrics operations
  getAiMetrics(): Promise<AiMetrics | undefined>;
  updateAiMetrics(metrics: InsertAiMetrics): Promise<AiMetrics>;
  
  // Blockchain Metrics operations
  getBlockchainMetrics(): Promise<BlockchainMetrics | undefined>;
  updateBlockchainMetrics(metrics: InsertBlockchainMetrics): Promise<BlockchainMetrics>;
  
  // AI Control Settings operations
  getAiControlSettings(): Promise<AiControlSettings | undefined>;
  updateAiControlSettings(settings: InsertAiControlSettings): Promise<AiControlSettings>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private complaints: Map<string, Complaint>;
  private departments: Map<string, Department>;
  private aiMetrics: AiMetrics | undefined;
  private blockchainMetrics: BlockchainMetrics | undefined;
  private aiControlSettings: AiControlSettings | undefined;

  constructor() {
    this.users = new Map();
    this.complaints = new Map();
    this.departments = new Map();
    this.initializeData();
  }

  private initializeData() {
    // Initialize departments
    const departmentData: InsertDepartment[] = [
      {
        name: "Water Department",
        activeCases: 23,
        capacity: 100,
        activeTeams: 4,
        avgResponseHours: 2.1
      },
      {
        name: "Traffic Control",
        activeCases: 15,
        capacity: 100,
        activeTeams: 3,
        avgResponseHours: 3.4
      },
      {
        name: "Electrical Department",
        activeCases: 8,
        capacity: 100,
        activeTeams: 2,
        avgResponseHours: 4.7
      },
      {
        name: "Sanitation Department",
        activeCases: 31,
        capacity: 100,
        activeTeams: 6,
        avgResponseHours: 6.2
      }
    ];

    departmentData.forEach(dept => {
      const id = randomUUID();
      this.departments.set(id, { 
        ...dept, 
        id,
        activeCases: dept.activeCases || 0,
        capacity: dept.capacity || 100,
        activeTeams: dept.activeTeams || 1,
        avgResponseHours: dept.avgResponseHours || 0
      });
    });

    // Initialize complaints
    const complaintData: InsertComplaint[] = [
      {
        complaintNumber: "ECO-2025-089",
        title: "Water Pipeline Burst",
        description: "Major water pipeline burst causing flooding",
        priority: "CRITICAL",
        status: "URGENT",
        department: "Water Department",
        location: "Sector 21, Block D",
        assignedTo: "Water Dept - Team A"
      },
      {
        complaintNumber: "ECO-2025-088",
        title: "Traffic Light Malfunction",
        description: "Traffic signal not working properly",
        priority: "MEDIUM",
        status: "ACTIVE",
        department: "Traffic Control",
        location: "MG Road Junction",
        assignedTo: "Traffic Control Unit"
      },
      {
        complaintNumber: "ECO-2025-087",
        title: "Street Light Repair",
        description: "Multiple street lights not functioning",
        priority: "LOW",
        status: "ACTIVE",
        department: "Electrical Department",
        location: "Park Avenue",
        assignedTo: "Electrical Dept - B"
      }
    ];

    complaintData.forEach(complaint => {
      const id = randomUUID();
      const now = new Date();
      this.complaints.set(id, { 
        ...complaint, 
        id, 
        description: complaint.description || null,
        assignedTo: complaint.assignedTo || null,
        createdAt: now, 
        updatedAt: now 
      });
    });

    // Initialize AI metrics
    this.aiMetrics = {
      id: randomUUID(),
      totalComplaints: 2847,
      aiAssignmentRate: 95.2,
      avgResponseHours: 4.2,
      resolutionRate: 87.5,
      predictionAccuracy: 96.8,
      autoAssignmentRate: 94.2,
      processingSpeedSeconds: 1.3,
      criticalDetected: 2684,
      updatedAt: new Date()
    };

    // Initialize blockchain metrics
    this.blockchainMetrics = {
      id: randomUUID(),
      blockHeight: 847293,
      verifiedRecords: 100,
      smartContracts: 2847,
      gasUsed: 0.004,
      networkActive: true,
      updatedAt: new Date()
    };

    // Initialize AI control settings
    this.aiControlSettings = {
      id: randomUUID(),
      manualOverride: false,
      autoAssignment: true,
      aiTraining: false,
      lastModelUpdate: new Date(),
      accuracy: 95.8,
      processedComplaints: 1247
    };
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Complaint operations
  async getAllComplaints(): Promise<Complaint[]> {
    return Array.from(this.complaints.values()).sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async getComplaint(id: string): Promise<Complaint | undefined> {
    return this.complaints.get(id);
  }

  async createComplaint(insertComplaint: InsertComplaint): Promise<Complaint> {
    const id = randomUUID();
    const now = new Date();
    const complaint: Complaint = { 
      ...insertComplaint, 
      id,
      description: insertComplaint.description || null,
      assignedTo: insertComplaint.assignedTo || null,
      createdAt: now, 
      updatedAt: now 
    };
    this.complaints.set(id, complaint);
    return complaint;
  }

  async updateComplaint(id: string, updateData: Partial<InsertComplaint>): Promise<Complaint | undefined> {
    const existing = this.complaints.get(id);
    if (!existing) return undefined;
    
    const updated: Complaint = { 
      ...existing, 
      ...updateData, 
      updatedAt: new Date() 
    };
    this.complaints.set(id, updated);
    return updated;
  }

  // Department operations
  async getAllDepartments(): Promise<Department[]> {
    return Array.from(this.departments.values());
  }

  async getDepartment(id: string): Promise<Department | undefined> {
    return this.departments.get(id);
  }

  async updateDepartment(id: string, updateData: Partial<InsertDepartment>): Promise<Department | undefined> {
    const existing = this.departments.get(id);
    if (!existing) return undefined;
    
    const updated: Department = { ...existing, ...updateData };
    this.departments.set(id, updated);
    return updated;
  }

  // AI Metrics operations
  async getAiMetrics(): Promise<AiMetrics | undefined> {
    return this.aiMetrics;
  }

  async updateAiMetrics(metrics: InsertAiMetrics): Promise<AiMetrics> {
    const prev = this.aiMetrics;
    this.aiMetrics = {
      id: prev?.id ?? randomUUID(),
      totalComplaints: metrics.totalComplaints ?? prev?.totalComplaints ?? 0,
      aiAssignmentRate: metrics.aiAssignmentRate ?? prev?.aiAssignmentRate ?? 0,
      avgResponseHours: metrics.avgResponseHours ?? prev?.avgResponseHours ?? 0,
      resolutionRate: metrics.resolutionRate ?? prev?.resolutionRate ?? 0,
      predictionAccuracy: metrics.predictionAccuracy ?? prev?.predictionAccuracy ?? 0,
      autoAssignmentRate: metrics.autoAssignmentRate ?? prev?.autoAssignmentRate ?? 0,
      processingSpeedSeconds: metrics.processingSpeedSeconds ?? prev?.processingSpeedSeconds ?? 0,
      criticalDetected: metrics.criticalDetected ?? prev?.criticalDetected ?? 0,
      updatedAt: new Date()
    };
    return this.aiMetrics;
  }

  // Blockchain Metrics operations
  async getBlockchainMetrics(): Promise<BlockchainMetrics | undefined> {
    return this.blockchainMetrics;
  }

  async updateBlockchainMetrics(metrics: InsertBlockchainMetrics): Promise<BlockchainMetrics> {
    const prev = this.blockchainMetrics;
    this.blockchainMetrics = {
      id: prev?.id ?? randomUUID(),
      blockHeight: metrics.blockHeight ?? prev?.blockHeight ?? 0,
      verifiedRecords: metrics.verifiedRecords ?? prev?.verifiedRecords ?? 0,
      smartContracts: metrics.smartContracts ?? prev?.smartContracts ?? 0,
      gasUsed: metrics.gasUsed ?? prev?.gasUsed ?? 0,
      networkActive: metrics.networkActive ?? prev?.networkActive ?? true,
      updatedAt: new Date()
    };
    return this.blockchainMetrics;
  }

  // AI Control Settings operations
  async getAiControlSettings(): Promise<AiControlSettings | undefined> {
    return this.aiControlSettings;
  }

  async updateAiControlSettings(settings: InsertAiControlSettings): Promise<AiControlSettings> {
    const prev = this.aiControlSettings;
    this.aiControlSettings = {
      id: prev?.id ?? randomUUID(),
      manualOverride: settings.manualOverride ?? prev?.manualOverride ?? false,
      autoAssignment: settings.autoAssignment ?? prev?.autoAssignment ?? true,
      aiTraining: settings.aiTraining ?? prev?.aiTraining ?? false,
      accuracy: settings.accuracy ?? prev?.accuracy ?? 0,
      processedComplaints: settings.processedComplaints ?? prev?.processedComplaints ?? 0,
      lastModelUpdate: settings.lastModelUpdate ?? prev?.lastModelUpdate ?? new Date()
    };
    return this.aiControlSettings;
  }
}

export const storage = new MemStorage();
