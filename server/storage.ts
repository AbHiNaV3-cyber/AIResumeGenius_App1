import { User, Resume, Template, InsertUser, ResumeContent } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getResume(id: number): Promise<Resume | undefined>;
  getResumesByUser(userId: number): Promise<Resume[]>;
  createResume(userId: number, templateId: number, title: string, content: ResumeContent): Promise<Resume>;
  updateResume(id: number, content: ResumeContent): Promise<Resume>;
  deleteResume(id: number): Promise<void>;
  
  getTemplates(): Promise<Template[]>;
  getTemplate(id: number): Promise<Template | undefined>;
  
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private resumes: Map<number, Resume>;
  private templates: Map<number, Template>;
  private currentUserId: number;
  private currentResumeId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.resumes = new Map();
    this.templates = new Map();
    this.currentUserId = 1;
    this.currentResumeId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });

    // Initialize with default templates
    this.templates.set(1, {
      id: 1,
      name: "Professional",
      description: "Clean and modern design suitable for corporate roles",
      structure: {
        layout: "classic",
        colors: { primary: "#2563eb", secondary: "#1e293b" }
      }
    });

    this.templates.set(2, {
      id: 2,
      name: "Creative",
      description: "Bold and unique design for creative industries",
      structure: {
        layout: "modern",
        colors: { primary: "#8b5cf6", secondary: "#1e293b" }
      }
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const newUser = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }

  async getResume(id: number): Promise<Resume | undefined> {
    return this.resumes.get(id);
  }

  async getResumesByUser(userId: number): Promise<Resume[]> {
    return Array.from(this.resumes.values()).filter(
      (resume) => resume.userId === userId
    );
  }

  async createResume(
    userId: number,
    templateId: number,
    title: string,
    content: ResumeContent
  ): Promise<Resume> {
    const id = this.currentResumeId++;
    const resume: Resume = {
      id,
      userId,
      templateId,
      title,
      content,
      createdAt: new Date().toISOString(),
    };
    this.resumes.set(id, resume);
    return resume;
  }

  async updateResume(id: number, content: ResumeContent): Promise<Resume> {
    const resume = await this.getResume(id);
    if (!resume) throw new Error("Resume not found");
    
    const updatedResume = { ...resume, content };
    this.resumes.set(id, updatedResume);
    return updatedResume;
  }

  async deleteResume(id: number): Promise<void> {
    this.resumes.delete(id);
  }

  async getTemplates(): Promise<Template[]> {
    return Array.from(this.templates.values());
  }

  async getTemplate(id: number): Promise<Template | undefined> {
    return this.templates.get(id);
  }
}

export const storage = new MemStorage();
