-- CreateEnum
CREATE TYPE "PortalUserStatus" AS ENUM ('ACTIVE', 'DISABLED');

-- CreateEnum
CREATE TYPE "PortalCaseAccessSource" AS ENUM ('CLAIM_LINK', 'ADMIN', 'IMPORT');

-- CreateTable
CREATE TABLE "portal_users" (
    "id" UUID NOT NULL,
    "displayName" TEXT,
    "primaryEmail" TEXT NOT NULL,
    "primaryEmailNormalized" TEXT NOT NULL,
    "status" "PortalUserStatus" NOT NULL DEFAULT 'ACTIVE',
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "portal_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portal_user_emails" (
    "id" UUID NOT NULL,
    "portalUserId" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "emailNormalized" TEXT NOT NULL,
    "verifiedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "portal_user_emails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portal_case_accesses" (
    "id" UUID NOT NULL,
    "portalUserId" UUID NOT NULL,
    "caseId" UUID NOT NULL,
    "source" "PortalCaseAccessSource" NOT NULL DEFAULT 'CLAIM_LINK',
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "portal_case_accesses_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "sessions" ADD COLUMN "portalUserId" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "portal_users_primaryEmailNormalized_key" ON "portal_users"("primaryEmailNormalized");

-- CreateIndex
CREATE INDEX "portal_users_status_updatedAt_idx" ON "portal_users"("status", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "portal_user_emails_emailNormalized_key" ON "portal_user_emails"("emailNormalized");

-- CreateIndex
CREATE INDEX "portal_user_emails_portalUserId_verifiedAt_idx" ON "portal_user_emails"("portalUserId", "verifiedAt");

-- CreateIndex
CREATE UNIQUE INDEX "portal_case_accesses_portalUserId_caseId_key" ON "portal_case_accesses"("portalUserId", "caseId");

-- CreateIndex
CREATE INDEX "portal_case_accesses_caseId_revokedAt_idx" ON "portal_case_accesses"("caseId", "revokedAt");

-- CreateIndex
CREATE INDEX "portal_case_accesses_portalUserId_revokedAt_idx" ON "portal_case_accesses"("portalUserId", "revokedAt");

-- CreateIndex
CREATE INDEX "sessions_portalUserId_expiresAt_idx" ON "sessions"("portalUserId", "expiresAt");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_portalUserId_fkey" FOREIGN KEY ("portalUserId") REFERENCES "portal_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portal_user_emails" ADD CONSTRAINT "portal_user_emails_portalUserId_fkey" FOREIGN KEY ("portalUserId") REFERENCES "portal_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portal_case_accesses" ADD CONSTRAINT "portal_case_accesses_portalUserId_fkey" FOREIGN KEY ("portalUserId") REFERENCES "portal_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portal_case_accesses" ADD CONSTRAINT "portal_case_accesses_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;
