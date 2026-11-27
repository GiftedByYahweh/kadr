CREATE TYPE "public"."currency" AS ENUM('UAH', 'EUR', 'USD');
ALTER TABLE "galleries" ADD COLUMN "currency" "currency" NOT NULL;
ALTER TABLE "galleries" ADD COLUMN "trashed_at" timestamp with time zone;
ALTER TABLE "galleries" DROP COLUMN "status";
DROP TYPE "public"."gallery_status";