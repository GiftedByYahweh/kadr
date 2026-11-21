import type { GalleryStatus } from "@kadr/shared"

export interface Gallery {
    id: string,
    userId: string,
    title: string,
    shareToken: string,
    status: GalleryStatus,
    trashedAt: Date | null,
    expiresAt: Date | null,
    includedCount: number,
    extraPrice: number,
    selectionSubmittedAt: Date | null,
    createdAt: Date,
    updatedAt: Date,
}