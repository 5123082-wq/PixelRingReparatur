-- CreateTable
CREATE TABLE "customer_profiles" (
    "id" UUID NOT NULL,
    "displayName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "emailNormalized" TEXT,
    "phoneNormalized" TEXT,
    "preferredLanguage" TEXT,
    "preferredContactMethod" "PrimaryContactMethod",
    "companyName" TEXT,
    "serviceAddress" TEXT,
    "consentNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_profiles_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "cases" ADD COLUMN "customerProfileId" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "customer_profiles_emailNormalized_key" ON "customer_profiles"("emailNormalized");

-- CreateIndex
CREATE UNIQUE INDEX "customer_profiles_phoneNormalized_key" ON "customer_profiles"("phoneNormalized");

-- CreateIndex
CREATE INDEX "customer_profiles_displayName_updatedAt_idx" ON "customer_profiles"("displayName", "updatedAt");

-- CreateIndex
CREATE INDEX "customer_profiles_updatedAt_idx" ON "customer_profiles"("updatedAt");

-- CreateIndex
CREATE INDEX "cases_customerProfileId_updatedAt_idx" ON "cases"("customerProfileId", "updatedAt");

-- AddForeignKey
ALTER TABLE "cases" ADD CONSTRAINT "cases_customerProfileId_fkey" FOREIGN KEY ("customerProfileId") REFERENCES "customer_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
