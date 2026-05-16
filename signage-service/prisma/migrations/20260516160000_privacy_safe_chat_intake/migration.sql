-- AlterTable
ALTER TABLE "cases" ADD COLUMN "serviceLocation" TEXT;

-- CreateTable
CREATE TABLE "session_intake_drafts" (
    "id" UUID NOT NULL,
    "sessionId" UUID NOT NULL,
    "customerName" TEXT,
    "customerEmail" TEXT,
    "customerPhone" TEXT,
    "serviceLocation" TEXT,
    "issueType" TEXT,
    "summary" TEXT,
    "locale" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "session_intake_drafts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "session_intake_drafts_sessionId_key" ON "session_intake_drafts"("sessionId");

-- CreateIndex
CREATE INDEX "session_intake_drafts_updatedAt_idx" ON "session_intake_drafts"("updatedAt");

-- AddForeignKey
ALTER TABLE "session_intake_drafts" ADD CONSTRAINT "session_intake_drafts_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
