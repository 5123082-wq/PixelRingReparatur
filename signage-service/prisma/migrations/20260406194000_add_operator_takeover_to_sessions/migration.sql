-- Add operator takeover flag to sessions
ALTER TABLE "sessions"
ADD COLUMN "operatorTakeover" BOOLEAN NOT NULL DEFAULT false;
