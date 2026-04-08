-- CreateEnum
CREATE TYPE "CmsArticleType" AS ENUM ('SYMPTOM', 'FAQ', 'PAGE', 'SERVICE', 'CASE');

-- CreateEnum
CREATE TYPE "CmsArticleStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- AlterTable
ALTER TABLE "cms_articles"
  ADD COLUMN "status" "CmsArticleStatus" NOT NULL DEFAULT 'DRAFT',
  ADD COLUMN "symptomLabel" TEXT,
  ADD COLUMN "shortAnswer" TEXT,
  ADD COLUMN "seoTitle" TEXT,
  ADD COLUMN "seoDescription" TEXT,
  ADD COLUMN "canonicalUrl" TEXT,
  ADD COLUMN "relatedSlugs" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "causes" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "safeChecks" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "urgentWarnings" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "serviceProcess" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "workScopeFactors" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "ctaLabel" TEXT,
  ADD COLUMN "ctaHref" TEXT,
  ADD COLUMN "sortOrder" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "publishedAt" TIMESTAMP(3),
  ADD COLUMN "lastReviewedAt" TIMESTAMP(3),
  ADD COLUMN "deletedAt" TIMESTAMP(3);

-- Backfill locale and type normalization
UPDATE "cms_articles"
SET "locale" = CASE
  WHEN "locale" IS NULL OR btrim("locale") = '' THEN 'de'
  ELSE lower(btrim("locale"))
END;

UPDATE "cms_articles"
SET "type" = CASE
  WHEN "type" IS NULL OR btrim("type") = '' THEN 'SYMPTOM'
  WHEN upper(btrim("type")) IN ('SYMPTOM', 'FAQ', 'PAGE', 'SERVICE', 'CASE') THEN upper(btrim("type"))
  ELSE 'PAGE'
END;

UPDATE "cms_articles"
SET "status" = CASE
  WHEN "isPublic" THEN 'PUBLISHED'::"CmsArticleStatus"
  ELSE 'DRAFT'::"CmsArticleStatus"
END;

UPDATE "cms_articles"
SET "publishedAt" = COALESCE("publishedAt", "createdAt")
WHERE "status" = 'PUBLISHED'::"CmsArticleStatus" AND "publishedAt" IS NULL;

UPDATE "cms_articles"
SET "symptomLabel" = "title"
WHERE "symptomLabel" IS NULL AND "type" = 'SYMPTOM';

-- Prepare enum conversion
ALTER TABLE "cms_articles" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "cms_articles"
  ALTER COLUMN "type" TYPE "CmsArticleType"
  USING (upper(btrim("type"))::"CmsArticleType");
ALTER TABLE "cms_articles" ALTER COLUMN "type" SET DEFAULT 'SYMPTOM';

-- Constraints / indexes
CREATE UNIQUE INDEX "cms_articles_locale_slug_key" ON "cms_articles"("locale", "slug");
CREATE INDEX "cms_articles_locale_type_status_sortOrder_idx" ON "cms_articles"("locale", "type", "status", "sortOrder");
CREATE INDEX "cms_articles_locale_type_status_publishedAt_idx" ON "cms_articles"("locale", "type", "status", "publishedAt");
CREATE INDEX "cms_articles_status_updatedAt_idx" ON "cms_articles"("status", "updatedAt");
CREATE INDEX "cms_articles_deletedAt_idx" ON "cms_articles"("deletedAt");

-- Drop old indexes/columns from phase 0 model
DROP INDEX IF EXISTS "cms_articles_slug_key";
DROP INDEX IF EXISTS "cms_articles_slug_idx";
DROP INDEX IF EXISTS "cms_articles_type_isPublic_idx";
ALTER TABLE "cms_articles" DROP COLUMN "isPublic";
