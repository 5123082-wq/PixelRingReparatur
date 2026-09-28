-- AlterEnum
ALTER TYPE "CaseStatus" ADD VALUE 'WORK_COMPLETED';

-- CreateTable
CREATE TABLE "work_results" (
    "id" UUID NOT NULL,
    "caseId" UUID NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,
    "publishedVersion" INTEGER NOT NULL DEFAULT 0,
    "draft" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_result_revisions" (
    "id" UUID NOT NULL,
    "workResultId" UUID NOT NULL,
    "number" INTEGER NOT NULL,
    "content" JSONB NOT NULL,
    "correctionReason" TEXT,
    "noPhotoReason" TEXT,
    "publishedById" UUID NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_result_revisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_result_photos" (
    "id" UUID NOT NULL,
    "revisionId" UUID NOT NULL,
    "attachmentId" UUID NOT NULL,
    "position" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "caption" TEXT,

    CONSTRAINT "work_result_photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_result_uploads" (
    "id" UUID NOT NULL,
    "caseId" UUID NOT NULL,
    "adminUserId" UUID NOT NULL,
    "pathname" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "attachmentId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_result_uploads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_result_notifications" (
    "id" UUID NOT NULL,
    "revisionId" UUID NOT NULL,
    "portalUserId" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "startedAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_result_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "work_results_caseId_key" ON "work_results"("caseId");

-- CreateIndex
CREATE UNIQUE INDEX "work_result_revisions_workResultId_number_key" ON "work_result_revisions"("workResultId", "number");

-- CreateIndex
CREATE UNIQUE INDEX "work_result_photos_revisionId_attachmentId_key" ON "work_result_photos"("revisionId", "attachmentId");

-- CreateIndex
CREATE UNIQUE INDEX "work_result_uploads_pathname_key" ON "work_result_uploads"("pathname");

-- CreateIndex
CREATE UNIQUE INDEX "work_result_uploads_attachmentId_key" ON "work_result_uploads"("attachmentId");

-- CreateIndex
CREATE INDEX "work_result_uploads_caseId_expiresAt_idx" ON "work_result_uploads"("caseId", "expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "work_result_notifications_revisionId_email_key" ON "work_result_notifications"("revisionId", "email");

-- AddForeignKey
ALTER TABLE "work_results" ADD CONSTRAINT "work_results_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_result_revisions" ADD CONSTRAINT "work_result_revisions_workResultId_fkey" FOREIGN KEY ("workResultId") REFERENCES "work_results"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_result_photos" ADD CONSTRAINT "work_result_photos_revisionId_fkey" FOREIGN KEY ("revisionId") REFERENCES "work_result_revisions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_result_photos" ADD CONSTRAINT "work_result_photos_attachmentId_fkey" FOREIGN KEY ("attachmentId") REFERENCES "attachments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_result_uploads" ADD CONSTRAINT "work_result_uploads_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_result_uploads" ADD CONSTRAINT "work_result_uploads_attachmentId_fkey" FOREIGN KEY ("attachmentId") REFERENCES "attachments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_result_notifications" ADD CONSTRAINT "work_result_notifications_revisionId_fkey" FOREIGN KEY ("revisionId") REFERENCES "work_result_revisions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

