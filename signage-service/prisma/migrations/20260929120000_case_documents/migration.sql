-- CreateTable
CREATE TABLE "case_documents" (
    "id" UUID NOT NULL,
    "caseId" UUID NOT NULL,
    "attachmentId" UUID NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'OTHER',
    "title" TEXT NOT NULL,
    "comment" TEXT NOT NULL DEFAULT '',
    "createdById" UUID NOT NULL,
    "publishedById" UUID,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "case_documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "case_documents_attachmentId_key" ON "case_documents"("attachmentId");

-- CreateIndex
CREATE INDEX "case_documents_caseId_publishedAt_idx" ON "case_documents"("caseId", "publishedAt");

-- AddForeignKey
ALTER TABLE "case_documents" ADD CONSTRAINT "case_documents_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_documents" ADD CONSTRAINT "case_documents_attachmentId_fkey" FOREIGN KEY ("attachmentId") REFERENCES "attachments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "case_documents" ADD CONSTRAINT "case_documents_type_check" CHECK ("type" IN ('INVOICE', 'CONTRACT', 'ACT', 'OTHER'));
