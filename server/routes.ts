import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { generateResume, analyzeResumeForATS } from "./openai";
import { resumeContentSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Get templates
  app.get("/api/templates", async (_req, res) => {
    const templates = await storage.getTemplates();
    res.json(templates);
  });

  // Get user's resumes
  app.get("/api/resumes", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const resumes = await storage.getResumesByUser(req.user.id);
    res.json(resumes);
  });

  // Create resume
  app.post("/api/resumes", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const validation = resumeContentSchema.safeParse(req.body.content);
    if (!validation.success) {
      return res.status(400).json(validation.error);
    }

    const resume = await storage.createResume(
      req.user.id,
      req.body.templateId,
      req.body.title,
      req.body.content
    );
    res.status(201).json(resume);
  });

  // Generate resume content
  app.post("/api/generate-resume", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const content = await generateResume({
        jobDescription: req.body.jobDescription,
        currentResume: req.body.currentResume,
        careerLevel: req.body.careerLevel,
        industry: req.body.industry
      });
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Analyze resume for ATS
  app.post("/api/analyze-resume", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const analysis = await analyzeResumeForATS(
        req.body.resume,
        req.body.jobDescription
      );
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
