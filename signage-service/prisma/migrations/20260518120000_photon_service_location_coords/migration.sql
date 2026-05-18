-- Store optional Photon-derived coordinates for service locations.
ALTER TABLE "cases"
ADD COLUMN "serviceLatitude" DOUBLE PRECISION,
ADD COLUMN "serviceLongitude" DOUBLE PRECISION,
ADD COLUMN "serviceLocationSource" TEXT;

ALTER TABLE "customer_profiles"
ADD COLUMN "serviceLatitude" DOUBLE PRECISION,
ADD COLUMN "serviceLongitude" DOUBLE PRECISION,
ADD COLUMN "serviceLocationSource" TEXT;

ALTER TABLE "session_intake_drafts"
ADD COLUMN "serviceLatitude" DOUBLE PRECISION,
ADD COLUMN "serviceLongitude" DOUBLE PRECISION,
ADD COLUMN "serviceLocationSource" TEXT;
