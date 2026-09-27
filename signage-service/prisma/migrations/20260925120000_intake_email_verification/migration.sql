CREATE TABLE "intake_email_verifications" (
    "id" UUID NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "emailNormalized" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "verifiedAt" TIMESTAMP(3),
    "consumedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "intake_email_verifications_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "intake_email_verifications_tokenHash_key" ON "intake_email_verifications"("tokenHash");
CREATE INDEX "intake_email_verifications_emailNormalized_createdAt_idx" ON "intake_email_verifications"("emailNormalized", "createdAt");
CREATE INDEX "intake_email_verifications_expiresAt_idx" ON "intake_email_verifications"("expiresAt");
