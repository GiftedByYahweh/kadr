import { GalleryMediaStatus } from '@kadr/shared';
import { sql } from 'drizzle-orm';
import {
  bigint,
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { pgEnumValues } from '../../../db/pg-enum-values.ts';
import { galleriesTable } from './galleries.table.ts';

export const galleryMediaStatusEnum = pgEnum(
  'gallery_media_status',
  pgEnumValues(GalleryMediaStatus),
);

export const galleryMediaTable = pgTable(
  'gallery_media',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    galleryId: uuid('gallery_id')
      .notNull()
      .references(() => galleriesTable.id, { onDelete: 'cascade' }),
    originalName: text('original_name').notNull(),
    storageKey: text('storage_key').notNull().unique(),
    previewKey: text('preview_key'),
    status: galleryMediaStatusEnum('status')
      .notNull()
      .default(GalleryMediaStatus.UPLOADING),
    contentType: text('content_type').notNull(),
    sizeBytes: bigint('size_bytes', { mode: 'number' }).notNull(),
    width: integer('width'),
    height: integer('height'),
    takenAt: timestamp('taken_at', { withTimezone: true }),
    position: integer('position').notNull(),
    likedAt: timestamp('liked_at', { withTimezone: true }),
    isCover: boolean('is_cover').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('gallery_media_gallery_position_idx').on(
      table.galleryId,
      table.position,
    ),
    uniqueIndex('gallery_media_one_cover_idx')
      .on(table.galleryId)
      .where(sql`${table.isCover}`),
  ],
);
