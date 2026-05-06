-- Telegram CRM conversation tracking.

ALTER TABLE "messages"
ADD COLUMN "externalChatId" TEXT,
ADD COLUMN "externalMessageId" TEXT;

CREATE TABLE "external_conversations" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "caseId" UUID NOT NULL,
  "channel" "CaseOriginChannel" NOT NULL,
  "externalChatId" TEXT NOT NULL,
  "externalUserId" TEXT,
  "username" TEXT,
  "firstName" TEXT,
  "lastName" TEXT,
  "lastMessageAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "external_conversations_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "messages_channel_externalChatId_externalMessageId_key"
ON "messages"("channel", "externalChatId", "externalMessageId");

CREATE INDEX "messages_channel_externalChatId_idx"
ON "messages"("channel", "externalChatId");

CREATE UNIQUE INDEX "external_conversations_channel_externalChatId_key"
ON "external_conversations"("channel", "externalChatId");

CREATE INDEX "external_conversations_caseId_idx"
ON "external_conversations"("caseId");

CREATE INDEX "external_conversations_channel_lastMessageAt_idx"
ON "external_conversations"("channel", "lastMessageAt");

ALTER TABLE "external_conversations"
ADD CONSTRAINT "external_conversations_caseId_fkey"
FOREIGN KEY ("caseId") REFERENCES "cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;
