-- Phase 2: Admin Portal - Add ON_HOLD status and AdminSession table

-- Add ON_HOLD to CaseStatus enum
ALTER TYPE "CaseStatus" ADD VALUE IF NOT EXISTS 'ON_HOLD' AFTER 'IN_PROGRESS';

-- Create admin_sessions table
CREATE TABLE "admin_sessions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tokenHash" TEXT NOT NULL,
    "label" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_sessions_pkey" PRIMARY KEY ("id")
);

-- Create unique index on tokenHash
CREATE UNIQUE INDEX "admin_sessions_tokenHash_key" ON "admin_sessions"("tokenHash");

-- Create index on expiresAt for cleanup queries
CREATE INDEX "admin_sessions_expiresAt_idx" ON "admin_sessions"("expiresAt");
