import { GalleryStatus } from '@kadr/shared';
import {
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { pgEnumValues } from '@db/pg-enum-values.ts';
import { usersTable } from '@modules/auth/tables/users.table.ts';

export const galleryStatusEnum = pgEnum(
  'gallery_status',
  pgEnumValues(GalleryStatus),
);

export const galleriesTable = pgTable(
  'galleries',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    shareToken: text('share_token').notNull().unique(),
    status: galleryStatusEnum('status').notNull().default(GalleryStatus.ACTIVE),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    includedCount: integer('included_count').notNull(),
    extraPrice: integer('extra_price').notNull(),
    selectionSubmittedAt: timestamp('selection_submitted_at', {
      withTimezone: true,
    }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index('galleries_user_id_idx').on(table.userId)],
);
