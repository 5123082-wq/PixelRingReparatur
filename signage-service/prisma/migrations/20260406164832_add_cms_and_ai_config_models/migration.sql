-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('MANAGER', 'OWNER');

-- AlterTable
ALTER TABLE "admin_sessions" ADD COLUMN     "role" "AdminRole" NOT NULL DEFAULT 'MANAGER',
ALTER COLUMN "id" DROP DEFAULT;

-- CreateTable
CREATE TABLE "cms_articles" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'SYMPTOM',
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "locale" TEXT NOT NULL DEFAULT 'de',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cms_articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_configs" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_configs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cms_articles_slug_key" ON "cms_articles"("slug");

-- CreateIndex
CREATE INDEX "cms_articles_slug_idx" ON "cms_articles"("slug");

-- CreateIndex
CREATE INDEX "cms_articles_type_isPublic_idx" ON "cms_articles"("type", "isPublic");

-- CreateIndex
CREATE UNIQUE INDEX "ai_configs_key_key" ON "ai_configs"("key");

-- CreateIndex
CREATE INDEX "ai_configs_key_idx" ON "ai_configs"("key");

-- CreateIndex
CREATE INDEX "admin_sessions_role_idx" ON "admin_sessions"("role");
