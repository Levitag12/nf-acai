// Zod enums separados para evitar conflitos
export const zodUserRoleEnum = z.enum(["ADMIN", "CONSULTANT"]);
export const zodDocumentStatusEnum = z.enum([
  "DELIVERED",
  "RECEIPT_CONFIRMED",
  "RETURN_SENT",
  "COMPLETED",
  "ARCHIVED",
]);
export const zodAttachmentTypeEnum = z.enum(["INITIAL", "RETURN"]);

// Schemas para inserção (Zod)
export const insertUserSchema = z.object({
  name: z.string(),
  username: z.string(),
  email: z.string(),
  hashedPassword: z.string(),
  role: zodUserRoleEnum.optional(), // Opcional se tiver default
});

export const insertDocumentSchema = z.object({
  title: z.string(),
  status: zodDocumentStatusEnum.optional(), // Opcional se tiver default
  consultantId: z.string(),
});

export const insertAttachmentSchema = z.object({
  documentId: z.string().uuid(),
  fileName: z.string(),
  fileUrl: z.string(),
  attachmentType: zodAttachmentTypeEnum,
});
