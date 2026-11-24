import { HttpStatusCode, type AdminGalleryDto } from "@kadr/shared";
import { AppError } from "@common/error/app.error";
import type { UseCase } from "@common/use-case/use-case";
import { galleryMapper } from "../mapper/gallery.mapper";
import type { GalleryRepository } from "../repositories/gallery.repository";
import { randomUUID } from 'node:crypto';

export interface CreateGalleryInput {
    userId: string;
    title: string;
    includedCount: number;
    extraPrice: number;
    expiresAt: Date | null;
}

export class CreateGalleryUseCase implements UseCase <
  CreateGalleryInput,
  AdminGalleryDto
> {
    constructor( 
        private readonly galleryRepository: GalleryRepository,
        private readonly galleryUrl: string,
    ) {}
    
    async execute(input: CreateGalleryInput): Promise<AdminGalleryDto> {
        const existing = await this.galleryRepository.findActiveByUserId(input.userId);
        if (existing) {
            throw new AppError(HttpStatusCode.CONFLICT)
        }
        const shareToken = randomUUID();
        const gallery = await this.galleryRepository.create({
            userId: input.userId,
            title: input.title,
            includedCount: input.includedCount,
            extraPrice: input.extraPrice,
            expiresAt: input.expiresAt,
            shareToken,
        })
        return galleryMapper.toAdminDto(gallery, this.galleryUrl)
    }
}