import { GalleryStatus, type AdminGalleryDto } from "@kadr/shared";
import type { UseCase } from "@common/use-case/use-case";
import { galleryMapper } from "../mapper/gallery.mapper";
import type { GalleryRepository } from "../repositories/gallery.repository";
import type { TokenService } from "@common/tokens/token-service";


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
        private readonly tokenService: TokenService
    ) {}
    
    async execute(input: CreateGalleryInput): Promise<AdminGalleryDto> {
        const shareToken = this.tokenService.generate();
        const created = await this.galleryRepository.create({
            userId: input.userId,
            title: input.title,
            includedCount: input.includedCount,
            extraPrice: input.extraPrice,
            expiresAt: input.expiresAt,
            shareToken,
            status: GalleryStatus.ACTIVE,
        })

    
        return galleryMapper.toAdminDto(created, this.galleryUrl)
    }
}