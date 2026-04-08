-- AlterTable
ALTER TABLE "cases" ADD COLUMN "assignedOperator" TEXT;

-- CreateIndex
CREATE INDEX "cases_assignedOperator_status_idx" ON "cases"("assignedOperator", "status");
