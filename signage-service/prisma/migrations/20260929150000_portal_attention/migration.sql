-- AlterTable
ALTER TABLE "portal_users" ADD COLUMN     "preferredLocale" TEXT;

-- CreateTable
CREATE TABLE "portal_attention" (
    "id" UUID NOT NULL,
    "caseId" UUID NOT NULL,
    "portalUserId" UUID NOT NULL,
    "sourceKey" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL DEFAULT '',
    "documentType" TEXT,
    "mode" TEXT NOT NULL DEFAULT 'ACKNOWLEDGE',
    "state" TEXT NOT NULL DEFAULT 'OPEN',
    "readAt" TIMESTAMP(3),
    "dueAt" TIMESTAMP(3),
    "submittedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "evidenceId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "portal_attention_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portal_attention_emails" (
    "id" UUID NOT NULL,
    "attentionId" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "nextAttemptAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "lastError" TEXT,
    "providerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "portal_attention_emails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "portal_attention_portalUserId_state_createdAt_idx" ON "portal_attention"("portalUserId", "state", "createdAt");

-- CreateIndex
CREATE INDEX "portal_attention_caseId_createdAt_idx" ON "portal_attention"("caseId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "portal_attention_portalUserId_sourceKey_key" ON "portal_attention"("portalUserId", "sourceKey");

-- CreateIndex
CREATE UNIQUE INDEX "portal_attention_emails_attentionId_key" ON "portal_attention_emails"("attentionId");

-- CreateIndex
CREATE INDEX "portal_attention_emails_state_nextAttemptAt_idx" ON "portal_attention_emails"("state", "nextAttemptAt");

-- AddForeignKey
ALTER TABLE "portal_attention" ADD CONSTRAINT "portal_attention_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portal_attention" ADD CONSTRAINT "portal_attention_portalUserId_fkey" FOREIGN KEY ("portalUserId") REFERENCES "portal_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portal_attention_emails" ADD CONSTRAINT "portal_attention_emails_attentionId_fkey" FOREIGN KEY ("attentionId") REFERENCES "portal_attention"("id") ON DELETE CASCADE ON UPDATE CASCADE;


ALTER TABLE portal_attention ADD CONSTRAINT portal_attention_kind_check CHECK (kind IN ('DOCUMENT','REPORT','REQUEST','MESSAGE','STATUS'));
ALTER TABLE portal_attention ADD CONSTRAINT portal_attention_mode_check CHECK (mode IN ('ACKNOWLEDGE','REPLY','UPLOAD','NONE'));
ALTER TABLE portal_attention ADD CONSTRAINT portal_attention_state_check CHECK (state IN ('OPEN','SUBMITTED','COMPLETED','CANCELLED'));
ALTER TABLE portal_attention_emails ADD CONSTRAINT portal_attention_email_state_check CHECK (state IN ('PENDING','SENDING','SENT','FAILED','SKIPPED'));
