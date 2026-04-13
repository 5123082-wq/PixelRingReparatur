-- CreateEnum
CREATE TYPE "CmsMediaUsageType" AS ENUM ('GENERAL', 'HERO', 'ARTICLE', 'SERVICE', 'CASE', 'PAGE', 'CARD', 'SEO', 'ICON');

-- CreateEnum
CREATE TYPE "CmsMediaStorageProvider" AS ENUM ('LOCAL', 'VERCEL_BLOB', 'S3', 'EXTERNAL');

-- CreateTable
CREATE TABLE "cms_media" (
    "id" UUID NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'de',
    "usageType" "CmsMediaUsageType" NOT NULL DEFAULT 'GENERAL',
    "storageProvider" "CmsMediaStorageProvider" NOT NULL DEFAULT 'LOCAL',
    "storageKey" TEXT NOT NULL,
    "publicUrl" TEXT NOT NULL,
    "originalFilename" TEXT,
    "title" TEXT,
    "altText" TEXT,
    "mimeType" TEXT NOT NULL,
    "byteSize" INTEGER NOT NULL,
    "checksumSha256" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "meta" JSONB,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cms_media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cms_media_storageKey_key" ON "cms_media"("storageKey");

-- CreateIndex
CREATE UNIQUE INDEX "cms_media_publicUrl_key" ON "cms_media"("publicUrl");

-- CreateIndex
CREATE INDEX "cms_media_locale_usageType_updatedAt_idx" ON "cms_media"("locale", "usageType", "updatedAt");

-- CreateIndex
CREATE INDEX "cms_media_mimeType_updatedAt_idx" ON "cms_media"("mimeType", "updatedAt");

-- CreateIndex
CREATE INDEX "cms_media_checksumSha256_idx" ON "cms_media"("checksumSha256");

-- CreateIndex
CREATE INDEX "cms_media_deletedAt_idx" ON "cms_media"("deletedAt");
