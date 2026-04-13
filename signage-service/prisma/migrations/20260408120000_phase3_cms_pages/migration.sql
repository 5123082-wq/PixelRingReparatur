-- CreateTable
CREATE TABLE "cms_pages" (
    "id" UUID NOT NULL,
    "pageKey" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'de',
    "status" "CmsArticleStatus" NOT NULL DEFAULT 'DRAFT',
    "title" TEXT NOT NULL,
    "blocks" JSONB NOT NULL,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "canonicalUrl" TEXT,
    "publishedAt" TIMESTAMP(3),
    "lastReviewedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cms_pages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cms_pages_pageKey_locale_key" ON "cms_pages"("pageKey", "locale");

-- CreateIndex
CREATE INDEX "cms_pages_locale_status_idx" ON "cms_pages"("locale", "status");

-- CreateIndex
CREATE INDEX "cms_pages_deletedAt_idx" ON "cms_pages"("deletedAt");
