import type { AdminGalleryDto, AdminGalleryListItemDto} from '@kadr/shared';
import type { Gallery } from '../entities/gallery.entity.ts';
import { galleriesTable } from '../tables/galleries.table.ts';

type GalleryRow = typeof galleriesTable.$inferSelect;

export const galleryMapper = {
    toEntity(row: GalleryRow): Gallery{
        return {
            id: row.id,
            userId: row.userId,
            title: row.title,
            shareToken: row.shareToken,
            status: row.status,
            trashedAt: row.trashedAt,
            expiresAt: row.expiresAt,
            includedCount: row.includedCount,
            extraPrice: row.extraPrice,
            selectionSubmittedAt: row.selectionSubmittedAt,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
        }
    },
    toAdminDto(gallery: Gallery): AdminGalleryDto{
        return {
            id: gallery.id,
            title: gallery.title,
            status: gallery.status,
            expiresAt: gallery.expiresAt ? gallery.expiresAt.toISOString() : null,
            trashedAt: gallery.trashedAt ? gallery.trashedAt.toISOString() : null,
            createdAt: gallery.createdAt.toISOString(),
            mediaCount: 0,       
            likedCount: 0,       
            coverUrl: null,      
            includedCount: gallery.includedCount,
            extraPrice: gallery.extraPrice,
            selectionSubmittedAt: gallery.selectionSubmittedAt ? gallery.selectionSubmittedAt.toISOString() : null, 
            shareUrl: gallery.shareToken,
        }
    },
    toListAdminDto(gallery: Gallery): AdminGalleryListItemDto{
        return {
            id: gallery.id,
            title: gallery.title,
            status: gallery.status,
            expiresAt: gallery.expiresAt ? gallery.expiresAt.toISOString() : null,
            trashedAt: gallery.trashedAt ? gallery.trashedAt.toISOString() : null,
            createdAt: gallery.createdAt.toISOString(),
            mediaCount: 0,
            likedCount: 0,
            coverUrl: null,
        }
    }
}