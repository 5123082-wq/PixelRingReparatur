-- Case-level AI automation control for external channel conversations.

ALTER TABLE "cases"
ADD COLUMN "aiEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "aiPausedAt" TIMESTAMP(3),
ADD COLUMN "aiPausedReason" TEXT;
