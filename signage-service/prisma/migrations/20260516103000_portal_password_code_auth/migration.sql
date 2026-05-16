-- CreateEnum
CREATE TYPE "PortalEmailCodePurpose" AS ENUM ('SIGNUP', 'PASSWORD_RESET', 'CLAIM_ACCESS');

-- AlterTable
ALTER TABLE "portal_users"
  ADD COLUMN "passwordHash" TEXT,
  ADD COLUMN "passwordSetAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "portal_email_codes" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "emailNormalized" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "verificationTokenHash" TEXT,
    "purpose" "PortalEmailCodePurpose" NOT NULL,
    "claimLinkId" UUID,
    "caseId" UUID,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "verifiedAt" TIMESTAMP(3),
    "consumedAt" TIMESTAMP(3),
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "portal_email_codes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "portal_email_codes_verificationTokenHash_key" ON "portal_email_codes"("verificationTokenHash");

-- CreateIndex
CREATE INDEX "portal_email_codes_emailNormalized_purpose_expiresAt_idx" ON "portal_email_codes"("emailNormalized", "purpose", "expiresAt");

-- CreateIndex
CREATE INDEX "portal_email_codes_claimLinkId_purpose_expiresAt_idx" ON "portal_email_codes"("claimLinkId", "purpose", "expiresAt");

-- CreateIndex
CREATE INDEX "portal_email_codes_caseId_purpose_expiresAt_idx" ON "portal_email_codes"("caseId", "purpose", "expiresAt");

-- CreateIndex
CREATE INDEX "portal_email_codes_expiresAt_idx" ON "portal_email_codes"("expiresAt");

-- AddForeignKey
ALTER TABLE "portal_email_codes" ADD CONSTRAINT "portal_email_codes_claimLinkId_fkey" FOREIGN KEY ("claimLinkId") REFERENCES "portal_claim_links"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portal_email_codes" ADD CONSTRAINT "portal_email_codes_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;
