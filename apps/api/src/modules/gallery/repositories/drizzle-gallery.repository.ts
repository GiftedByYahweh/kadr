import { and, eq } from 'drizzle-orm';
import type { DbProvider } from '@db/db.provider.ts';
import { firstRowOrThrow } from '@db/helpers.ts';
import { GalleryStatus } from '@kadr/shared';
import type { Gallery } from '../entities/gallery.entity.ts';
import { galleryMapper } from '../mapper/gallery.mapper.ts';
import { galleriesTable } from '../tables/galleries.table.ts';
import type { CreateGalleryData, GalleryRepository } from './gallery.repository.ts';

export class DrizzleGalleryRepository implements GalleryRepository {
    constructor(private readonly db:DbProvider) {}

    async findById(id: string): Promise<Gallery | null> {
        const rows = await this.db
        .current()
        .select()
        .from(galleriesTable)
        .where(eq(galleriesTable.id, id));
        const row = rows[0];
        if (!row) return null;
        return galleryMapper.toEntity(row)

    }

    async findActiveByUserId(userId: string): Promise<Gallery | null> {
        const rows = await this.db
        .current()
        .select()
        .from(galleriesTable)
        .where(
            and(
                eq(galleriesTable.userId, userId),
                eq(galleriesTable.status,GalleryStatus.ACTIVE)))
        const row = rows[0];
        if (!row) return null;
        return galleryMapper.toEntity(row)
    }

    async create(data: CreateGalleryData): Promise<Gallery> {
        const rows = await this.db
        .current()
        .insert(galleriesTable)
        .values(data)
        .returning()
        return galleryMapper.toEntity(firstRowOrThrow(rows))

    }

    async findManyByUserId(userId: string, status?: GalleryStatus): Promise<Gallery[]> {
        const conditions = [eq(galleriesTable.userId, userId)];
        if(status) {
            conditions.push(eq(galleriesTable.status, status));
        }
        const rows = await this.db
        .current()
        .select()
        .from(galleriesTable)
        .where(and(...conditions) );
          return rows.map(row=> galleryMapper.toEntity(row))
    }
}