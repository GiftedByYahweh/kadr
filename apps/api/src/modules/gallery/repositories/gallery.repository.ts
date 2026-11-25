import type { GalleryStatus } from "@kadr/shared";
import type { Gallery } from "../entities/gallery.entity";

export interface CreateGalleryData {
    userId: string,
    title: string,
    shareToken: string;
    includedCount: number;
    extraPrice: number;
    expiresAt: Date | null;
    status: GalleryStatus
}

export interface GalleryRepository {
    findById(id: string): Promise<Gallery | null>,
    findActiveByUserId(userId: string): Promise<Gallery | null>,
    create(data: CreateGalleryData): Promise<Gallery>,
    findManyByUserId(userId: string, status?: GalleryStatus): Promise <Gallery[]>
}