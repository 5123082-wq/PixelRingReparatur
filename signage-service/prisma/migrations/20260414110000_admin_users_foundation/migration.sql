CREATE TYPE "AdminUserStatus" AS ENUM ('ACTIVE', 'DISABLED');

CREATE TABLE "admin_users" (
  "id" UUID NOT NULL,
  "email" TEXT NOT NULL,
  "displayName" TEXT,
  "passwordHash" TEXT NOT NULL,
  "role" "AdminRole" NOT NULL DEFAULT 'MANAGER',
  "status" "AdminUserStatus" NOT NULL DEFAULT 'ACTIVE',
  "lastLoginAt" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");
CREATE INDEX "admin_users_role_status_idx" ON "admin_users"("role", "status");
CREATE INDEX "admin_users_status_updatedAt_idx" ON "admin_users"("status", "updatedAt");

ALTER TABLE "admin_sessions"
  ADD COLUMN "adminUserId" UUID,
  ADD COLUMN "lastSeenAt" TIMESTAMPTZ,
  ADD COLUMN "revokedAt" TIMESTAMPTZ;

ALTER TABLE "admin_audit_logs"
  ADD COLUMN "actorAdminUserId" UUID;

DELETE FROM "admin_sessions";

ALTER TABLE "admin_sessions"
  ALTER COLUMN "adminUserId" SET NOT NULL;

ALTER TABLE "admin_sessions"
  ADD CONSTRAINT "admin_sessions_adminUserId_fkey"
  FOREIGN KEY ("adminUserId") REFERENCES "admin_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "admin_audit_logs"
  ADD CONSTRAINT "admin_audit_logs_actorAdminUserId_fkey"
  FOREIGN KEY ("actorAdminUserId") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "admin_sessions_adminUserId_expiresAt_idx" ON "admin_sessions"("adminUserId", "expiresAt");
CREATE INDEX "admin_sessions_revokedAt_idx" ON "admin_sessions"("revokedAt");
CREATE INDEX "admin_audit_logs_actorAdminUserId_createdAt_idx" ON "admin_audit_logs"("actorAdminUserId", "createdAt");
