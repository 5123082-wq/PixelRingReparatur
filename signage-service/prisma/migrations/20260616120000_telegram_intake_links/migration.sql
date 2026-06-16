CREATE TABLE "telegram_intake_links" (
  "id" UUID NOT NULL,
  "tokenHash" TEXT NOT NULL,
  "caseId" UUID NOT NULL,
  "externalConversationId" UUID NOT NULL,
  "telegramChatId" TEXT NOT NULL,
  "telegramUserId" TEXT,
  "locale" TEXT,
  "returnNonce" TEXT NOT NULL,
  "openedAt" TIMESTAMP(3),
  "submittedAt" TIMESTAMP(3),
  "revokedAt" TIMESTAMP(3),
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "telegram_intake_links_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "telegram_intake_links_tokenHash_key" ON "telegram_intake_links"("tokenHash");
CREATE UNIQUE INDEX "telegram_intake_links_returnNonce_key" ON "telegram_intake_links"("returnNonce");
CREATE INDEX "telegram_intake_links_caseId_expiresAt_idx" ON "telegram_intake_links"("caseId", "expiresAt");
CREATE INDEX "telegram_intake_links_externalConversationId_expiresAt_idx" ON "telegram_intake_links"("externalConversationId", "expiresAt");
CREATE INDEX "telegram_intake_links_expiresAt_idx" ON "telegram_intake_links"("expiresAt");
CREATE INDEX "telegram_intake_links_telegramChatId_createdAt_idx" ON "telegram_intake_links"("telegramChatId", "createdAt");
CREATE INDEX "telegram_intake_links_submittedAt_idx" ON "telegram_intake_links"("submittedAt");

ALTER TABLE "telegram_intake_links"
  ADD CONSTRAINT "telegram_intake_links_caseId_fkey"
  FOREIGN KEY ("caseId") REFERENCES "cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "telegram_intake_links"
  ADD CONSTRAINT "telegram_intake_links_externalConversationId_fkey"
  FOREIGN KEY ("externalConversationId") REFERENCES "external_conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
