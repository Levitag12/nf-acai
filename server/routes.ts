import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertDocumentSchema, insertAttachmentSchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
// import { put } from "@vercel/blob";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve uploaded files statically
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Document routes
  app.get("/api/documents", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      let documents;
      if (user.role === "ADMIN") {
        documents = await storage.getAllDocuments();
      } else {
        documents = await storage.getDocumentsByConsultant(userId);
      }

      res.json(documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  app.get("/api/documents/:id", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const document = await storage.getDocumentById(id);
      
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      // Check if user has access to this document
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== "ADMIN" && document.consultantId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json(document);
    } catch (error) {
      console.error("Error fetching document:", error);
      res.status(500).json({ message: "Failed to fetch document" });
    }
  });

  app.post("/api/documents", isAuthenticated, upload.single('file'), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== "ADMIN") {
        return res.status(403).json({ message: "Only admins can create documents" });
      }

      const { title, consultantId } = req.body;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ message: "File is required" });
      }

      // Validate document data
      const documentData = insertDocumentSchema.parse({
        title,
        consultantId,
      });

      // Create document
      const document = await storage.createDocument(documentData);

      // Create uploads directory if it doesn't exist
      const uploadsDir = join(process.cwd(), 'uploads');
      try {
        mkdirSync(uploadsDir, { recursive: true });
      } catch (err) {
        // Directory already exists
      }

      // Save file locally
      const fileName = `${Date.now()}-${file.originalname}`;
      const filePath = join(uploadsDir, fileName);
      writeFileSync(filePath, file.buffer);
      
      const fileUrl = `/uploads/${fileName}`;

      // Create initial attachment
      const attachment = await storage.createAttachment({
        documentId: document.id,
        fileName: file.originalname,
        fileUrl: fileUrl,
        attachmentType: "INITIAL",
      });

      res.json({ document, attachment });
    } catch (error) {
      console.error("Error creating document:", error);
      res.status(500).json({ message: "Failed to create document" });
    }
  });

  app.patch("/api/documents/:id/status", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const userId = req.user.claims.sub;
      
      const document = await storage.getDocumentById(id);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      const user = await storage.getUser(userId);
      
      // Check permissions and valid status transitions
      if (user?.role === "ADMIN") {
        // Admin can confirm return received (RETURN_SENT -> COMPLETED)
        if (status === "COMPLETED" && document.status === "RETURN_SENT") {
          const updatedDocument = await storage.updateDocumentStatus(id, status);
          return res.json(updatedDocument);
        }
      } else if (user?.role === "CONSULTANT" && document.consultantId === userId) {
        // Consultant can confirm receipt (DELIVERED -> RECEIPT_CONFIRMED)
        if (status === "RECEIPT_CONFIRMED" && document.status === "DELIVERED") {
          const updatedDocument = await storage.updateDocumentStatus(id, status);
          return res.json(updatedDocument);
        }
      }

      res.status(400).json({ message: "Invalid status transition" });
    } catch (error) {
      console.error("Error updating document status:", error);
      res.status(500).json({ message: "Failed to update document status" });
    }
  });

  app.post("/api/documents/:id/return", isAuthenticated, upload.single('file'), async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.claims.sub;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ message: "File is required" });
      }

      const document = await storage.getDocumentById(id);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      // Check if consultant owns this document and status is correct
      if (document.consultantId !== userId || document.status !== "RECEIPT_CONFIRMED") {
        return res.status(403).json({ message: "Cannot submit return for this document" });
      }

      // Create uploads directory if it doesn't exist
      const uploadsDir = join(process.cwd(), 'uploads');
      try {
        mkdirSync(uploadsDir, { recursive: true });
      } catch (err) {
        // Directory already exists
      }

      // Save file locally
      const fileName = `${Date.now()}-${file.originalname}`;
      const filePath = join(uploadsDir, fileName);
      writeFileSync(filePath, file.buffer);
      
      const fileUrl = `/uploads/${fileName}`;

      // Create return attachment
      const attachment = await storage.createAttachment({
        documentId: id,
        fileName: file.originalname,
        fileUrl: fileUrl,
        attachmentType: "RETURN",
      });

      // Update document status to RETURN_SENT
      const updatedDocument = await storage.updateDocumentStatus(id, "RETURN_SENT");

      res.json({ document: updatedDocument, attachment });
    } catch (error) {
      console.error("Error submitting return:", error);
      res.status(500).json({ message: "Failed to submit return" });
    }
  });

  // Get consultants endpoint
  app.get("/api/consultants", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== "ADMIN") {
        return res.status(403).json({ message: "Only admins can view consultants" });
      }

      // Get all users with CONSULTANT role
      const consultants = await storage.getAllConsultants();
      res.json(consultants);
    } catch (error) {
      console.error("Error fetching consultants:", error);
      res.status(500).json({ message: "Failed to fetch consultants" });
    }
  });

  // Stats endpoint
  app.get("/api/stats", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      let documents;
      if (user.role === "ADMIN") {
        documents = await storage.getAllDocuments();
      } else {
        documents = await storage.getDocumentsByConsultant(userId);
      }

      const stats = {
        delivered: documents.filter(d => d.status === "DELIVERED").length,
        receiptConfirmed: documents.filter(d => d.status === "RECEIPT_CONFIRMED").length,
        returnSent: documents.filter(d => d.status === "RETURN_SENT").length,
        completed: documents.filter(d => d.status === "COMPLETED").length,
        total: documents.length,
      };

      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
