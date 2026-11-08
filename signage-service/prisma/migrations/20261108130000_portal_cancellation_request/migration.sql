ALTER TABLE "cases"
  ADD COLUMN "cancellationRequestedAt" TIMESTAMP(3),
  ADD COLUMN "cancellationReason" TEXT;
