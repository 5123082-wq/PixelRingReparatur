-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "CaseStatus" AS ENUM ('DRAFT', 'FORMALIZED', 'NUMBER_ISSUED', 'UNDER_REVIEW', 'WAITING_FOR_CUSTOMER', 'IN_PROGRESS', 'READY_FOR_PICKUP', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CaseOriginChannel" AS ENUM ('WEBSITE_CHAT', 'WEBSITE_FORM', 'TELEGRAM', 'WHATSAPP', 'PHONE', 'EMAIL', 'CRM', 'MANUAL');

-- CreateEnum
CREATE TYPE "PrimaryContactMethod" AS ENUM ('EMAIL', 'PHONE', 'TELEGRAM', 'WHATSAPP');

-- CreateEnum
CREATE TYPE "MessageAuthorRole" AS ENUM ('CUSTOMER', 'OPERATOR', 'SYSTEM');

-- CreateEnum
CREATE TYPE "AttachmentKind" AS ENUM ('IMAGE', 'VIDEO', 'DOCUMENT', 'AUDIO', 'OTHER');

-- CreateEnum
CREATE TYPE "AttachmentStorageProvider" AS ENUM ('PENDING', 'VERCEL_BLOB', 'S3', 'LOCAL');

-- CreateEnum
CREATE TYPE "SessionScope" AS ENUM ('ANONYMOUS_DRAFT', 'CASE_ACCESS', 'PORTAL_AUTH');

-- CreateTable
CREATE TABLE "cases" (
    "id" UUID NOT NULL,
    "publicRequestNumber" TEXT,
    "status" "CaseStatus" NOT NULL DEFAULT 'DRAFT',
    "originChannel" "CaseOriginChannel" NOT NULL,
    "customerName" TEXT,
    "customerEmail" TEXT,
    "customerPhone" TEXT,
    "primaryContactMethod" "PrimaryContactMethod",
    "primaryContactValue" TEXT,
    "summary" TEXT,
    "description" TEXT,
    "locale" TEXT,
    "crmLeadId" TEXT,
    "crmCaseId" TEXT,
    "numberIssuedAt" TIMESTAMP(3),
    "formalizedAt" TIMESTAMP(3),
    "statusUpdatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" UUID NOT NULL,
    "caseId" UUID,
    "sessionId" UUID,
    "channel" "CaseOriginChannel" NOT NULL,
    "authorRole" "MessageAuthorRole" NOT NULL,
    "authorName" TEXT,
    "body" TEXT NOT NULL,
    "isCustomerVisible" BOOLEAN NOT NULL DEFAULT true,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attachments" (
    "id" UUID NOT NULL,
    "caseId" UUID,
    "messageId" UUID,
    "uploadedBySessionId" UUID,
    "kind" "AttachmentKind" NOT NULL,
    "storageProvider" "AttachmentStorageProvider" NOT NULL DEFAULT 'PENDING',
    "storageKey" TEXT NOT NULL,
    "originalFilename" TEXT,
    "mimeType" TEXT NOT NULL,
    "byteSize" INTEGER NOT NULL,
    "checksumSha256" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "durationSeconds" INTEGER,
    "isCustomerVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" UUID NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "scope" "SessionScope" NOT NULL DEFAULT 'ANONYMOUS_DRAFT',
    "caseId" UUID,
    "contactMethod" "PrimaryContactMethod",
    "contactValue" TEXT,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "lastSeenAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cases_publicRequestNumber_key" ON "cases"("publicRequestNumber");

-- CreateIndex
CREATE INDEX "cases_status_updatedAt_idx" ON "cases"("status", "updatedAt");

-- CreateIndex
CREATE INDEX "cases_originChannel_createdAt_idx" ON "cases"("originChannel", "createdAt");

-- CreateIndex
CREATE INDEX "cases_customerEmail_idx" ON "cases"("customerEmail");

-- CreateIndex
CREATE INDEX "cases_customerPhone_idx" ON "cases"("customerPhone");

-- CreateIndex
CREATE INDEX "cases_primaryContactMethod_primaryContactValue_idx" ON "cases"("primaryContactMethod", "primaryContactValue");

-- CreateIndex
CREATE INDEX "messages_caseId_createdAt_idx" ON "messages"("caseId", "createdAt");

-- CreateIndex
CREATE INDEX "messages_sessionId_createdAt_idx" ON "messages"("sessionId", "createdAt");

-- CreateIndex
CREATE INDEX "messages_authorRole_createdAt_idx" ON "messages"("authorRole", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "attachments_storageKey_key" ON "attachments"("storageKey");

-- CreateIndex
CREATE INDEX "attachments_caseId_createdAt_idx" ON "attachments"("caseId", "createdAt");

-- CreateIndex
CREATE INDEX "attachments_messageId_idx" ON "attachments"("messageId");

-- CreateIndex
CREATE INDEX "attachments_uploadedBySessionId_idx" ON "attachments"("uploadedBySessionId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_tokenHash_key" ON "sessions"("tokenHash");

-- CreateIndex
CREATE INDEX "sessions_caseId_expiresAt_idx" ON "sessions"("caseId", "expiresAt");

-- CreateIndex
CREATE INDEX "sessions_expiresAt_idx" ON "sessions"("expiresAt");

-- CreateIndex
CREATE INDEX "sessions_contactMethod_contactValue_idx" ON "sessions"("contactMethod", "contactValue");

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_uploadedBySessionId_fkey" FOREIGN KEY ("uploadedBySessionId") REFERENCES "sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "cases"("id") ON DELETE SET NULL ON UPDATE CASCADE;
