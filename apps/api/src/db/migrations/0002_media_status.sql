ALTER TYPE "public"."gallery_media_status" RENAME TO "media_status";
ALTER TYPE "public"."media_status" ADD VALUE 'processing' BEFORE 'ready';