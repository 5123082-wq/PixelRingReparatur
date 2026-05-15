-- CreateTable
CREATE TABLE "portal_claim_links" (
    "id" UUID NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "caseId" UUID NOT NULL,
    "locale" TEXT,
    "prefillEmail" TEXT,
    "requestedEmail" TEXT,
    "createdByAdminSessionId" UUID,
    "lastOpenedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "portal_claim_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portal_email_verifications" (
    "id" UUID NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "claimLinkId" UUID NOT NULL,
    "caseId" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "emailNormalized" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "verifiedAt" TIMESTAMP(3),
    "consumedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "portal_email_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "portal_claim_links_tokenHash_key" ON "portal_claim_links"("tokenHash");

-- CreateIndex
CREATE INDEX "portal_claim_links_caseId_expiresAt_idx" ON "portal_claim_links"("caseId", "expiresAt");

-- CreateIndex
CREATE INDEX "portal_claim_links_expiresAt_idx" ON "portal_claim_links"("expiresAt");

-- CreateIndex
CREATE INDEX "portal_claim_links_revokedAt_idx" ON "portal_claim_links"("revokedAt");

-- CreateIndex
CREATE UNIQUE INDEX "portal_email_verifications_tokenHash_key" ON "portal_email_verifications"("tokenHash");

-- CreateIndex
CREATE INDEX "portal_email_verifications_caseId_emailNormalized_idx" ON "portal_email_verifications"("caseId", "emailNormalized");

-- CreateIndex
CREATE INDEX "portal_email_verifications_claimLinkId_expiresAt_idx" ON "portal_email_verifications"("claimLinkId", "expiresAt");

-- CreateIndex
CREATE INDEX "portal_email_verifications_expiresAt_idx" ON "portal_email_verifications"("expiresAt");

-- AddForeignKey
ALTER TABLE "portal_claim_links" ADD CONSTRAINT "portal_claim_links_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portal_claim_links" ADD CONSTRAINT "portal_claim_links_createdByAdminSessionId_fkey" FOREIGN KEY ("createdByAdminSessionId") REFERENCES "admin_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portal_email_verifications" ADD CONSTRAINT "portal_email_verifications_claimLinkId_fkey" FOREIGN KEY ("claimLinkId") REFERENCES "portal_claim_links"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portal_email_verifications" ADD CONSTRAINT "portal_email_verifications_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;
