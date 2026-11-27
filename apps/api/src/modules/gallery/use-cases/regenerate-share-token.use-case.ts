import { DomainErrorCode, type AdminGalleryDto } from '@kadr/shared';
import { AppError } from '@common/error/app.error.ts';
import type { TokenService } from '@common/tokens/token-service.ts';
import type { UseCase } from '@common/use-case/use-case.ts';
import type { GalleryWithStats } from '../entities/gallery.entity.ts';
import { galleryMapper } from '../mappers/gallery.mapper.ts';
import type { GalleryRepository } from '../repositories/gallery.repository.ts';

export interface RegenerateShareTokenInput {
  id: string;
  userId: string;
}

export class RegenerateShareTokenUseCase implements UseCase<
  RegenerateShareTokenInput,
  AdminGalleryDto
> {
  constructor(
    private readonly galleryRepository: GalleryRepository,
    private readonly tokenService: TokenService,
    private readonly galleryUrl: string,
  ) {}

  async execute(input: RegenerateShareTokenInput): Promise<AdminGalleryDto> {
    const gallery = await this.galleryRepository.findOwnedWithStats(
      input.id,
      input.userId,
    );
    if (!gallery) throw new AppError(DomainErrorCode.GALLERY_NOT_FOUND);
    if (gallery.trashedAt !== null) {
      throw new AppError(DomainErrorCode.GALLERY_TRASHED);
    }

    const shareToken = this.tokenService.generate();
    await this.galleryRepository.updateShareToken(input.id, shareToken);
    const galleryWithToken: GalleryWithStats = { ...gallery, shareToken };
    return galleryMapper.toAdminDto(galleryWithToken, this.galleryUrl);
  }
}
