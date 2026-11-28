import { MediaStatus } from '@kadr/shared';
import { and, asc, count, eq, inArray, max } from 'drizzle-orm';
import type { DbProvider } from '@db/db.provider.ts';
import { firstRowOrThrow } from '@db/helpers.ts';
import type { GalleryMedia } from '../entities/gallery-media.entity.ts';
import { galleryMediaMapper } from '../mappers/gallery-media.mapper.ts';
import { galleriesTable } from '../tables/galleries.table.ts';
import { galleryMediaTable } from '../tables/gallery-media.table.ts';
import type {
  CreateGalleryMediaData,
  GalleryMediaRepository,
} from './gallery-media.repository.ts';

export class DrizzleGalleryMediaRepository implements GalleryMediaRepository {
  constructor(private readonly db: DbProvider) {}

  async countInGallery(galleryId: string): Promise<number> {
    const rows = await this.db
      .current()
      .select({ total: count() })
      .from(galleryMediaTable)
      .where(eq(galleryMediaTable.galleryId, galleryId));
    return firstRowOrThrow(rows).total;
  }

  async countUploadingByUser(userId: string): Promise<number> {
    const rows = await this.db
      .current()
      .select({ total: count() })
      .from(galleryMediaTable)
      .innerJoin(
        galleriesTable,
        eq(galleriesTable.id, galleryMediaTable.galleryId),
      )
      .where(
        and(
          eq(galleriesTable.userId, userId),
          eq(galleryMediaTable.status, MediaStatus.UPLOADING),
        ),
      );
    return firstRowOrThrow(rows).total;
  }

  async findLastPosition(galleryId: string): Promise<number | null> {
    const rows = await this.db
      .current()
      .select({ last: max(galleryMediaTable.position) })
      .from(galleryMediaTable)
      .where(eq(galleryMediaTable.galleryId, galleryId));
    return firstRowOrThrow(rows).last;
  }

  async createUploading(data: CreateGalleryMediaData[]): Promise<void> {
    await this.db.current().insert(galleryMediaTable).values(data);
  }

  async findInGallery(
    galleryId: string,
    ids: string[],
  ): Promise<GalleryMedia[]> {
    const rows = await this.db
      .current()
      .select()
      .from(galleryMediaTable)
      .where(
        and(
          eq(galleryMediaTable.galleryId, galleryId),
          inArray(galleryMediaTable.id, ids),
        ),
      )
      .orderBy(asc(galleryMediaTable.position));
    return rows.map((row) => galleryMediaMapper.toEntity(row));
  }

  async markProcessing(ids: string[]): Promise<void> {
    await this.db
      .current()
      .update(galleryMediaTable)
      .set({ status: MediaStatus.PROCESSING })
      .where(inArray(galleryMediaTable.id, ids));
  }
}
