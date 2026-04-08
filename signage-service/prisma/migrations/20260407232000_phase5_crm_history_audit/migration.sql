-- CreateTable
CREATE TABLE "case_status_events" (
    "id" UUID NOT NULL,
    "caseId" UUID NOT NULL,
    "actorSessionId" UUID,
    "actorRole" "AdminRole",
    "fromStatus" "CaseStatus",
    "toStatus" "CaseStatus" NOT NULL,
    "reason" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "case_status_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_audit_logs" (
    "id" UUID NOT NULL,
    "actorSessionId" UUID,
    "actorRole" "AdminRole",
    "action" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "resourceId" TEXT,
    "caseId" UUID,
    "outcome" TEXT NOT NULL DEFAULT 'SUCCESS',
    "reason" TEXT,
    "details" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "case_status_events_caseId_createdAt_idx" ON "case_status_events"("caseId", "createdAt");

-- CreateIndex
CREATE INDEX "case_status_events_actorSessionId_createdAt_idx" ON "case_status_events"("actorSessionId", "createdAt");

-- CreateIndex
CREATE INDEX "case_status_events_toStatus_createdAt_idx" ON "case_status_events"("toStatus", "createdAt");

-- CreateIndex
CREATE INDEX "admin_audit_logs_createdAt_idx" ON "admin_audit_logs"("createdAt");

-- CreateIndex
CREATE INDEX "admin_audit_logs_action_createdAt_idx" ON "admin_audit_logs"("action", "createdAt");

-- CreateIndex
CREATE INDEX "admin_audit_logs_resourceType_resourceId_idx" ON "admin_audit_logs"("resourceType", "resourceId");

-- CreateIndex
CREATE INDEX "admin_audit_logs_caseId_createdAt_idx" ON "admin_audit_logs"("caseId", "createdAt");

-- CreateIndex
CREATE INDEX "admin_audit_logs_actorSessionId_createdAt_idx" ON "admin_audit_logs"("actorSessionId", "createdAt");

-- AddForeignKey
ALTER TABLE "case_status_events" ADD CONSTRAINT "case_status_events_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_status_events" ADD CONSTRAINT "case_status_events_actorSessionId_fkey" FOREIGN KEY ("actorSessionId") REFERENCES "admin_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_audit_logs" ADD CONSTRAINT "admin_audit_logs_actorSessionId_fkey" FOREIGN KEY ("actorSessionId") REFERENCES "admin_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_audit_logs" ADD CONSTRAINT "admin_audit_logs_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "cases"("id") ON DELETE SET NULL ON UPDATE CASCADE;
