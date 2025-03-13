import { pgTable, text, serial, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const templateStructureSchema = z.object({
  layout: z.enum(["classic", "modern"]),
  colors: z.object({
    primary: z.string(),
    secondary: z.string()
  })
});

export const templates = pgTable("templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  structure: jsonb("structure").$type<z.infer<typeof templateStructureSchema>>().notNull(),
});

export const resumes = pgTable("resumes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  templateId: integer("template_id").references(() => templates.id),
  title: text("title").notNull(),
  content: jsonb("content").notNull(),
  createdAt: text("created_at").notNull(),
});

export const insertUserSchema = createInsertSchema(users);
export const insertResumeSchema = createInsertSchema(resumes);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Resume = typeof resumes.$inferSelect;
export type Template = typeof templates.$inferSelect;
export type TemplateStructure = z.infer<typeof templateStructureSchema>;

export const resumeContentSchema = z.object({
  personalInfo: z.object({
    fullName: z.string(),
    email: z.string().email(),
    phone: z.string(),
    location: z.string(),
  }),
  summary: z.string(),
  experience: z.array(z.object({
    title: z.string(),
    company: z.string(),
    location: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    description: z.string(),
  })),
  education: z.array(z.object({
    degree: z.string(),
    school: z.string(),
    location: z.string(),
    graduationDate: z.string(),
  })),
  skills: z.array(z.string()),
});

export type ResumeContent = z.infer<typeof resumeContentSchema>;