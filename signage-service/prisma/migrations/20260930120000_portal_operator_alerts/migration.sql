-- AlterTable
ALTER TABLE "cases" ADD COLUMN     "aiControlVersion" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "portalAttentionVersion" INTEGER;

-- AlterTable
ALTER TABLE "case_read_states" ADD COLUMN     "portalReadVersion" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "crm_case_presences" (
    "id" UUID NOT NULL,
    "caseId" UUID NOT NULL,
    "adminSessionId" UUID NOT NULL,
    "tabId" UUID NOT NULL,
    "sequence" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crm_case_presences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portal_operator_alert_states" (
    "caseId" UUID NOT NULL,
    "latestVersion" INTEGER NOT NULL DEFAULT 0,
    "readVersion" INTEGER NOT NULL DEFAULT 0,
    "generation" INTEGER NOT NULL DEFAULT 0,
    "pendingVersion" INTEGER NOT NULL DEFAULT 0,
    "pendingReason" TEXT,
    "sentAt" TIMESTAMP(3),
    "attemptId" UUID,
    "leaseUntil" TIMESTAMP(3),
    "deliveryState" TEXT NOT NULL DEFAULT 'IDLE',
    "lastErrorCode" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "portal_operator_alert_states_pkey" PRIMARY KEY ("caseId")
);

-- CreateIndex
CREATE INDEX "crm_case_presences_caseId_expiresAt_idx" ON "crm_case_presences"("caseId", "expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "crm_case_presences_caseId_adminSessionId_tabId_key" ON "crm_case_presences"("caseId", "adminSessionId", "tabId");

-- AddForeignKey
ALTER TABLE "crm_case_presences" ADD CONSTRAINT "crm_case_presences_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_case_presences" ADD CONSTRAINT "crm_case_presences_adminSessionId_fkey" FOREIGN KEY ("adminSessionId") REFERENCES "admin_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portal_operator_alert_states" ADD CONSTRAINT "portal_operator_alert_states_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;
