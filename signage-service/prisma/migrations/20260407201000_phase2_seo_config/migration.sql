-- CreateTable
CREATE TABLE "cms_seo_configs" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cms_seo_configs_pkey" PRIMARY KEY ("key")
);
