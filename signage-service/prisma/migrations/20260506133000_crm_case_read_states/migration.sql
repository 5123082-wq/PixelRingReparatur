-- Per-manager CRM inbox read state.

CREATE TABLE "case_read_states" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "caseId" UUID NOT NULL,
  "adminUserId" UUID NOT NULL,
  "lastReadAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "case_read_states_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "case_read_states_caseId_adminUserId_key"
ON "case_read_states"("caseId", "adminUserId");

CREATE INDEX "case_read_states_adminUserId_updatedAt_idx"
ON "case_read_states"("adminUserId", "updatedAt");

CREATE INDEX "case_read_states_caseId_lastReadAt_idx"
ON "case_read_states"("caseId", "lastReadAt");

ALTER TABLE "case_read_states"
ADD CONSTRAINT "case_read_states_caseId_fkey"
FOREIGN KEY ("caseId") REFERENCES "cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "case_read_states"
ADD CONSTRAINT "case_read_states_adminUserId_fkey"
FOREIGN KEY ("adminUserId") REFERENCES "admin_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
