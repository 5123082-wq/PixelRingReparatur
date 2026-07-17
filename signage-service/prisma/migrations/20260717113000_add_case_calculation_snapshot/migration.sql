-- Store versioned, language-independent calculator context with a CRM case.
-- Apply separately with the project's reviewed migration workflow.
ALTER TABLE "cases"
ADD COLUMN "calculation_snapshot" JSONB;
