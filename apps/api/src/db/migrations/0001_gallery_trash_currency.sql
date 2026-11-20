CREATE TYPE "public"."currency" AS ENUM('UAH', 'EUR', 'USD');
ALTER TABLE "galleries" ALTER COLUMN "status" SET DATA TYPE text;
ALTER TABLE "galleries" ALTER COLUMN "status" SET DEFAULT 'active'::text;
DROP TYPE "public"."gallery_status";
CREATE TYPE "public"."gallery_status" AS ENUM('active', 'trashed');
ALTER TABLE "galleries" ALTER COLUMN "status" SET DEFAULT 'active'::"public"."gallery_status";
ALTER TABLE "galleries" ALTER COLUMN "status" SET DATA TYPE "public"."gallery_status" USING "status"::"public"."gallery_status";
ALTER TABLE "galleries" ADD COLUMN "currency" "currency" NOT NULL;
ALTER TABLE "galleries" ADD COLUMN "trashed_at" timestamp with time zone;