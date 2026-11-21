import { GalleryMediaStatus, GalleryStatus } from '@kadr/shared';
import { and, count, desc, eq, isNotNull, sql, type SQL } from 'drizzle-orm';
import type { DbProvider } from '@db/db.provider.ts';
import { firstRowOrThrow } from '@db/helpers.ts';
import type {
  Gallery,
  GalleryCounts,
  GalleryWithStats,
} from '../entities/gallery.entity.ts';
import { galleryMapper } from '../mappers/gallery.mapper.ts';
import { galleriesTable } from '../tables/galleries.table.ts';
import { galleryMediaTable } from '../tables/gallery-media.table.ts';
import type {
  CreateGalleryData,
  GalleryListFilter,
  GalleryRepository,
  UpdateGalleryData,
  UpdateGalleryStatusData,
} from './gallery.repository.ts';

export class DrizzleGalleryRepository implements GalleryRepository {
  constructor(private readonly db: DbProvider) {}

  async findOwnedWithStats(
    id: string,
    userId: string,
  ): Promise<GalleryWithStats | null> {
    const rows = await this.selectWithStats().where(
      and(eq(galleriesTable.id, id), eq(galleriesTable.userId, userId)),
    );
    const row = rows[0];
    if (!row) return null;
    return galleryMapper.toEntityWithStats(row);
  }

  async listWithStats(filter: GalleryListFilter): Promise<GalleryWithStats[]> {
    const titleMatches = filter.search
      ? DrizzleGalleryRepository.titleContains(filter.search)
      : undefined;
    const conditions = and(
      eq(galleriesTable.userId, filter.userId),
      eq(galleriesTable.status, filter.status),
      titleMatches,
    );
    const rows = await this.selectWithStats()
      .where(conditions)
      .orderBy(desc(galleriesTable.createdAt), desc(galleriesTable.id))
      .limit(filter.limit)
      .offset(filter.offset);
    return rows.map((row) => galleryMapper.toEntityWithStats(row));
  }

  async countByStatus(userId: string): Promise<GalleryCounts> {
    const rows = await this.db
      .current()
      .select({ status: galleriesTable.status, total: count() })
      .from(galleriesTable)
      .where(eq(galleriesTable.userId, userId))
      .groupBy(galleriesTable.status);

    const counts: GalleryCounts = {
      [GalleryStatus.ACTIVE]: 0,
      [GalleryStatus.TRASHED]: 0,
    };
    for (const row of rows) {
      counts[row.status] = row.total;
    }
    return counts;
  }

  async create(data: CreateGalleryData): Promise<Gallery> {
    const rows = await this.db
      .current()
      .insert(galleriesTable)
      .values(data)
      .returning();
    return galleryMapper.toEntity(firstRowOrThrow(rows));
  }

  async update(id: string, data: UpdateGalleryData): Promise<void> {
    await this.db
      .current()
      .update(galleriesTable)
      .set(data)
      .where(eq(galleriesTable.id, id));
  }

  async updateShareToken(id: string, shareToken: string): Promise<void> {
    await this.db
      .current()
      .update(galleriesTable)
      .set({ shareToken })
      .where(eq(galleriesTable.id, id));
  }

  async updateStatus(id: string, data: UpdateGalleryStatusData): Promise<void> {
    await this.db
      .current()
      .update(galleriesTable)
      .set(data)
      .where(eq(galleriesTable.id, id));
  }

  async findMediaKeys(galleryId: string): Promise<string[]> {
    const rows = await this.db
      .current()
      .select({
        storageKey: galleryMediaTable.storageKey,
        previewKey: galleryMediaTable.previewKey,
      })
      .from(galleryMediaTable)
      .where(eq(galleryMediaTable.galleryId, galleryId));

    const keys: string[] = [];
    for (const row of rows) {
      keys.push(row.storageKey);
      if (row.previewKey) keys.push(row.previewKey);
    }
    return keys;
  }

  async delete(id: string): Promise<void> {
    await this.db
      .current()
      .delete(galleriesTable)
      .where(eq(galleriesTable.id, id));
  }

  private selectWithStats() {
    return this.db
      .current()
      .select({
        gallery: galleriesTable,
        mediaCount: DrizzleGalleryRepository.countMediaWhere(
          eq(galleryMediaTable.status, GalleryMediaStatus.READY),
        ),
        likedCount: DrizzleGalleryRepository.countMediaWhere(
          and(
            eq(galleryMediaTable.status, GalleryMediaStatus.READY),
            isNotNull(galleryMediaTable.likedAt),
          ),
        ),
      })
      .from(galleriesTable)
      .leftJoin(
        galleryMediaTable,
        eq(galleryMediaTable.galleryId, galleriesTable.id),
      )
      .groupBy(galleriesTable.id)
      .$dynamic();
  }

  private static countMediaWhere(condition: SQL | undefined) {
    return sql<number>`count(${galleryMediaTable.id}) filter (where ${condition})`.mapWith(
      Number,
    );
  }

  private static titleContains(search: string): SQL {
    return sql`strpos(lower(${galleriesTable.title}), lower(${search})) > 0`;
  }
}
