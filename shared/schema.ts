import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  uuid,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Enums
export const userRoleEnum = pgEnum("user_role", ["ADMIN", "CONSULTANT"]);
export const documentStatusEnum = pgEnum("document_status", ["DELIVERED", "RECEIPT_CONFIRMED", "RETURN_SENT", "COMPLETED", "ARCHIVED"]);
export const attachmentTypeEnum = pgEnum("attachment_type", ["INITIAL", "RETURN"]);

// Tabela de Usuários (CORRIGIDA para usar username)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  username: varchar("username").unique().notNull(), // <-- Campo principal para login
  email: varchar("email").notNull(),
  name: varchar("name").notNull(),
  hashedPassword: text("hashed_password").notNull(),
  role: userRoleEnum("role").notNull().default("CONSULTANT"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Outras tabelas e relações (sem alterações)
export const sessions = pgTable("sessions", { sid: varchar("sid").primaryKey(), sess: jsonb("sess").notNull(), expire: timestamp("expire").notNull(), }, (table) => [index("IDX_session_expire").on(table.expire)]);
export const documents = pgTable("documents", { id: uuid("id").primaryKey().defaultRandom(), title: text("title").notNull(), status: documentStatusEnum("status").default("DELIVERED").notNull(), consultantId: varchar("consultant_id").references(() => users.id, { onDelete: 'cascade' }).notNull(), createdAt: timestamp("created_at").defaultNow(), updatedAt: timestamp("updated_at").defaultNow() });
export const attachments = pgTable("attachments", { id: uuid("id").primaryKey().defaultRandom(), documentId: uuid("document_id").references(() => documents.id, { onDelete: 'cascade' }).notNull(), fileName: text("file_name").notNull(), fileUrl: text("file_url").notNull(), attachmentType: attachmentTypeEnum("attachment_type").notNull(), uploadedAt: timestamp("uploaded_at").defaultNow() });
export const usersRelations = relations(users, ({ many }) => ({ documents: many(documents) }));
export const documentsRelations = relations(documents, ({ one, many }) => ({ consultant: one(users, { fields: [documents.consultantId], references: [users.id] }), attachments: many(attachments) }));
export const attachmentsRelations = relations(attachments, ({ one }) => ({ document: one(documents, { fields: [attachments.documentId], references: [documents.id] }) }));

// Schemas e Tipos
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });
export const insertDocumentSchema = createInsertSchema(documents).omit({ id: true, createdAt: true, updatedAt: true });
export const insertAttachmentSchema = createInsertSchema(attachments).omit({ id: true, uploadedAt: true });
export type User = typeof users.$inferSelect;