import { DomainErrorCode, type AdminGalleryDto } from '@kadr/shared';
import { AppError } from '@common/error/app.error.ts';
import type { UseCase } from '@common/use-case/use-case.ts';
import { galleryMapper } from '../mappers/gallery.mapper.ts';
import type { GalleryRepository } from '../repositories/gallery.repository.ts';

export interface TrashGalleryInput {
  id: string;
  userId: string;
}

export class TrashGalleryUseCase implements UseCase<
  TrashGalleryInput,
  AdminGalleryDto
> {
  constructor(
    private readonly galleryRepository: GalleryRepository,
    private readonly galleryUrl: string,
  ) {}

  async execute(input: TrashGalleryInput): Promise<AdminGalleryDto> {
    const gallery = await this.galleryRepository.findOwnedWithStats(
      input.id,
      input.userId,
    );
    if (!gallery) throw new AppError(DomainErrorCode.GALLERY_NOT_FOUND);
    if (gallery.trashedAt !== null) {
      throw new AppError(DomainErrorCode.GALLERY_TRASHED);
    }

    const trashedAt = new Date();
    await this.galleryRepository.updateTrash(input.id, {
      trashedAt,
      expiresAt: gallery.expiresAt,
    });

    return galleryMapper.toAdminDto(
      {
        ...gallery,
        trashedAt,
      },
      this.galleryUrl,
    );
  }
}
