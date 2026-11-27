import {
  DomainErrorCode,
  type AdminGalleryDto,
  type CreateGalleryRequest,
} from '@kadr/shared';
import { AppError } from '@common/error/app.error.ts';
import type { TokenService } from '@common/tokens/token-service.ts';
import type { UseCase } from '@common/use-case/use-case.ts';
import type { GalleryWithStats } from '../entities/gallery.entity.ts';
import { galleryMapper } from '../mappers/gallery.mapper.ts';
import type { GalleryRepository } from '../repositories/gallery.repository.ts';

export interface CreateGalleryInput extends CreateGalleryRequest {
  userId: string;
}

export class CreateGalleryUseCase implements UseCase<
  CreateGalleryInput,
  AdminGalleryDto
> {
  constructor(
    private readonly galleryRepository: GalleryRepository,
    private readonly tokenService: TokenService,
    private readonly galleryUrl: string,
  ) {}

  async execute(input: CreateGalleryInput): Promise<AdminGalleryDto> {
    if (input.expiresAt !== null && input.expiresAt <= new Date()) {
      throw new AppError(DomainErrorCode.GALLERY_EXPIRY_IN_PAST);
    }

    const shareToken = this.tokenService.generate();
    const created = await this.galleryRepository.create({
      userId: input.userId,
      title: input.title,
      shareToken,
      expiresAt: input.expiresAt,
      includedCount: input.includedCount,
      extraPrice: input.extraPrice,
      currency: input.currency,
    });
    const gallery: GalleryWithStats = {
      ...created,
      mediaCount: 0,
      likedCount: 0,
    };
    return galleryMapper.toAdminDto(gallery, this.galleryUrl);
  }
}
