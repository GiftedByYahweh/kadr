import { index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { galleryMediaTable } from './gallery-media.table.ts';

export const galleryCommentsTable = pgTable(
  'gallery_comments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    mediaId: uuid('media_id')
      .notNull()
      .references(() => galleryMediaTable.id, { onDelete: 'cascade' }),
    text: text('text').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index('gallery_comments_media_id_idx').on(table.mediaId)],
);
