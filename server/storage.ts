import {
  users,
  documents,
  attachments,
  type User,
  type UpsertUser,
  type InsertDocument,
  type InsertAttachment,
  type Document,
  type Attachment,
  type DocumentWithConsultant,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  
  // Document operations
  createDocument(document: InsertDocument): Promise<Document>;
  getDocumentById(id: string): Promise<DocumentWithConsultant | undefined>;
  getDocumentsByConsultant(consultantId: string): Promise<DocumentWithConsultant[]>;
  getAllDocuments(): Promise<DocumentWithConsultant[]>;
  updateDocumentStatus(id: string, status: "DELIVERED" | "RECEIPT_CONFIRMED" | "RETURN_SENT" | "COMPLETED"): Promise<Document>;
  
  // Attachment operations
  createAttachment(attachment: InsertAttachment): Promise<Attachment>;
  getAttachmentsByDocument(documentId: string): Promise<Attachment[]>;
  getAttachmentsByType(documentId: string, type: "INITIAL" | "RETURN"): Promise<Attachment[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  // Document operations
  async createDocument(document: InsertDocument): Promise<Document> {
    const [newDocument] = await db
      .insert(documents)
      .values(document)
      .returning();
    return newDocument;
  }

  async getDocumentById(id: string): Promise<DocumentWithConsultant | undefined> {
    const result = await db
      .select()
      .from(documents)
      .leftJoin(users, eq(documents.consultantId, users.id))
      .leftJoin(attachments, eq(documents.id, attachments.documentId))
      .where(eq(documents.id, id));

    if (result.length === 0) return undefined;

    const document = result[0].documents;
    const consultant = result[0].users!;
    const attachmentsList = result
      .filter(r => r.attachments)
      .map(r => r.attachments!);

    return {
      ...document,
      consultant,
      attachments: attachmentsList,
    };
  }

  async getDocumentsByConsultant(consultantId: string): Promise<DocumentWithConsultant[]> {
    const result = await db
      .select()
      .from(documents)
      .leftJoin(users, eq(documents.consultantId, users.id))
      .leftJoin(attachments, eq(documents.id, attachments.documentId))
      .where(eq(documents.consultantId, consultantId))
      .orderBy(desc(documents.createdAt));

    return this.groupDocumentsWithRelations(result);
  }

  async getAllDocuments(): Promise<DocumentWithConsultant[]> {
    const result = await db
      .select()
      .from(documents)
      .leftJoin(users, eq(documents.consultantId, users.id))
      .leftJoin(attachments, eq(documents.id, attachments.documentId))
      .orderBy(desc(documents.createdAt));

    return this.groupDocumentsWithRelations(result);
  }

  async updateDocumentStatus(id: string, status: "DELIVERED" | "RECEIPT_CONFIRMED" | "RETURN_SENT" | "COMPLETED"): Promise<Document> {
    const [updatedDocument] = await db
      .update(documents)
      .set({ status, updatedAt: new Date() })
      .where(eq(documents.id, id))
      .returning();
    return updatedDocument;
  }

  // Attachment operations
  async createAttachment(attachment: InsertAttachment): Promise<Attachment> {
    const [newAttachment] = await db
      .insert(attachments)
      .values(attachment)
      .returning();
    return newAttachment;
  }

  async getAttachmentsByDocument(documentId: string): Promise<Attachment[]> {
    return await db
      .select()
      .from(attachments)
      .where(eq(attachments.documentId, documentId));
  }

  async getAttachmentsByType(documentId: string, type: "INITIAL" | "RETURN"): Promise<Attachment[]> {
    return await db
      .select()
      .from(attachments)
      .where(and(
        eq(attachments.documentId, documentId),
        eq(attachments.attachmentType, type)
      ));
  }

  private groupDocumentsWithRelations(result: any[]): DocumentWithConsultant[] {
    const documentsMap = new Map<string, DocumentWithConsultant>();

    result.forEach(row => {
      const document = row.documents;
      const consultant = row.users!;
      const attachment = row.attachments;

      if (!documentsMap.has(document.id)) {
        documentsMap.set(document.id, {
          ...document,
          consultant,
          attachments: [],
        });
      }

      if (attachment) {
        const existingDoc = documentsMap.get(document.id)!;
        if (!existingDoc.attachments.some(a => a.id === attachment.id)) {
          existingDoc.attachments.push(attachment);
        }
      }
    });

    return Array.from(documentsMap.values());
  }
}

export const storage = new DatabaseStorage();
