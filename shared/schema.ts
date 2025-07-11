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
export const documentStatusEnum = pgEnum("document_status", [
  "DELIVERED",
  "RECEIPT_CONFIRMED",
  "RETURN_SENT",
  "COMPLETED",
  "ARCHIVED",
]);
export const attachmentTypeEnum = pgEnum("attachment_type", ["INITIAL", "RETURN"]);

// Sessões
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => ({
    expireIndex: index("IDX_session_expire").on(table.expire),
  })
);

// Usuários
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  username: varchar("username").unique().notNull(),
  email: varchar("email").notNull(),
  name: varchar("name").notNull(),
  hashedPassword: text("hashed_password").notNull(),
  role: userRoleEnum("role").notNull().default("CONSULTANT"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Documentos
export const documents = pgTable("documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  status: documentStatusEnum("status").default("DELIVERED").notNull(),
  consultantId: varchar("consultant_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Anexos
export const attachments = pgTable("attachments", {
  id: uuid("id").primaryKey().defaultRandom(),
  documentId: uuid("document_id")
    .references(() => documents.id, { onDelete: "cascade" })
    .notNull(),
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  attachmentType: attachmentTypeEnum("attachment_type").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

// Relações
export const usersRelations = relations(users, ({ many }) => ({
  documents: many(documents),
}));

export const documentsRelations = relations(documents, ({ one, many }) => ({
  consultant: one(users, {
    fields: [documents.consultantId],
    references: [users.id],
  }),
  attachments: many(attachments),
}));

export const attachmentsRelations = relations(attachments, ({ one }) => ({
  document: one(documents, {
    fields: [attachments.documentId],
    references: [documents.id],
  }),
}));

// Schemas para Zod (inserção)
export const insertUserSchema = createInsertSchema(users, {
  role: z.enum(["ADMIN", "CONSULTANT"]),
});

export const insertDocumentSchema = createInsertSchema(documents, {
  status: z.enum([
    "DELIVERED",
    "RECEIPT_CONFIRMED",
    "RETURN_SENT",
    "COMPLETED",
    "ARCHIVED",
  ]),
});

export const insertAttachmentSchema = createInsertSchema(attachments, {
  attachmentType: z.enum(["INITIAL", "RETURN"]),
});

// Tipos inferidos
export type User = typeof users.$inferSelect;
export type UpsertUser = typeof users.$inferInsert;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;

export type Attachment = typeof attachments.$inferSelect;
export type InsertAttachment = z.infer<typeof insertAttachmentSchema>;

export type DocumentWithConsultant = Document & {
  consultant: User;
  attachments: Attachment[];
};
