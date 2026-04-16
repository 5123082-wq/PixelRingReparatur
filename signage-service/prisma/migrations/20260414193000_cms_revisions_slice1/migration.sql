CREATE TYPE "CmsRevisionSourceAction" AS ENUM (
  'CREATE',
  'UPDATE',
  'PUBLISH',
  'UNPUBLISH',
  'RESTORE'
);

CREATE TABLE "cms_article_revisions" (
  "id" UUID NOT NULL,
  "articleId" UUID NOT NULL,
  "sourceAction" "CmsRevisionSourceAction" NOT NULL DEFAULT 'UPDATE',
  "reason" TEXT,
  "actorAdminUserId" UUID,
  "actorSessionId" UUID,
  "actorRole" "AdminRole",
  "snapshot" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "cms_article_revisions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "cms_page_revisions" (
  "id" UUID NOT NULL,
  "pageId" UUID NOT NULL,
  "sourceAction" "CmsRevisionSourceAction" NOT NULL DEFAULT 'UPDATE',
  "reason" TEXT,
  "actorAdminUserId" UUID,
  "actorSessionId" UUID,
  "actorRole" "AdminRole",
  "snapshot" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "cms_page_revisions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "cms_article_revisions_articleId_createdAt_idx"
  ON "cms_article_revisions"("articleId", "createdAt");
CREATE INDEX "cms_article_revisions_createdAt_idx"
  ON "cms_article_revisions"("createdAt");
CREATE INDEX "cms_article_revisions_actorAdminUserId_createdAt_idx"
  ON "cms_article_revisions"("actorAdminUserId", "createdAt");
CREATE INDEX "cms_article_revisions_actorSessionId_createdAt_idx"
  ON "cms_article_revisions"("actorSessionId", "createdAt");

CREATE INDEX "cms_page_revisions_pageId_createdAt_idx"
  ON "cms_page_revisions"("pageId", "createdAt");
CREATE INDEX "cms_page_revisions_createdAt_idx"
  ON "cms_page_revisions"("createdAt");
CREATE INDEX "cms_page_revisions_actorAdminUserId_createdAt_idx"
  ON "cms_page_revisions"("actorAdminUserId", "createdAt");
CREATE INDEX "cms_page_revisions_actorSessionId_createdAt_idx"
  ON "cms_page_revisions"("actorSessionId", "createdAt");

ALTER TABLE "cms_article_revisions"
  ADD CONSTRAINT "cms_article_revisions_articleId_fkey"
  FOREIGN KEY ("articleId") REFERENCES "cms_articles"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "cms_page_revisions"
  ADD CONSTRAINT "cms_page_revisions_pageId_fkey"
  FOREIGN KEY ("pageId") REFERENCES "cms_pages"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
