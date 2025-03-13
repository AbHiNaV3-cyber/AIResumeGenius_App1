import { users, resumes, templates, type User, type Resume, type Template, type InsertUser, type ResumeContent } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

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

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool,
      createTableIfMissing: true
    });

    // Initialize templates
    this.initializeTemplates().catch(console.error);
  }

  private async initializeTemplates() {
    const existingTemplates = await db.select().from(templates);
    if (existingTemplates.length === 0) {
      await db.insert(templates).values([
        {
          id: 1,
          name: "Professional",
          description: "Clean and modern design suitable for corporate roles",
          structure: {
            layout: "classic",
            colors: { primary: "#2563eb", secondary: "#1e293b" }
          }
        },
        {
          id: 2,
          name: "Creative",
          description: "Bold and unique design for creative industries",
          structure: {
            layout: "modern",
            colors: { primary: "#8b5cf6", secondary: "#1e293b" }
          }
        }
      ]);
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async getResume(id: number): Promise<Resume | undefined> {
    const [resume] = await db.select().from(resumes).where(eq(resumes.id, id));
    return resume;
  }

  async getResumesByUser(userId: number): Promise<Resume[]> {
    return db.select().from(resumes).where(eq(resumes.userId, userId));
  }

  async createResume(
    userId: number,
    templateId: number,
    title: string,
    content: ResumeContent
  ): Promise<Resume> {
    const [resume] = await db
      .insert(resumes)
      .values({
        userId,
        templateId,
        title,
        content,
        createdAt: new Date().toISOString(),
      })
      .returning();
    return resume;
  }

  async updateResume(id: number, content: ResumeContent): Promise<Resume> {
    const [updatedResume] = await db
      .update(resumes)
      .set({ content })
      .where(eq(resumes.id, id))
      .returning();

    if (!updatedResume) {
      throw new Error("Resume not found");
    }

    return updatedResume;
  }

  async deleteResume(id: number): Promise<void> {
    await db.delete(resumes).where(eq(resumes.id, id));
  }

  async getTemplates(): Promise<Template[]> {
    return db.select().from(templates);
  }

  async getTemplate(id: number): Promise<Template | undefined> {
    const [template] = await db.select().from(templates).where(eq(templates.id, id));
    return template;
  }
}

export const storage = new DatabaseStorage();