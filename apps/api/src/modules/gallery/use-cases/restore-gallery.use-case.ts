import {
  DomainErrorCode,
  type AdminGalleryDto,
  type RestoreGalleryRequest,
} from '@kadr/shared';
import { AppError } from '@common/error/app.error.ts';
import type { UseCase } from '@common/use-case/use-case.ts';
import { galleryMapper } from '../mappers/gallery.mapper.ts';
import type { GalleryRepository } from '../repositories/gallery.repository.ts';

export interface RestoreGalleryInput extends RestoreGalleryRequest {
  id: string;
  userId: string;
}

export class RestoreGalleryUseCase implements UseCase<
  RestoreGalleryInput,
  AdminGalleryDto
> {
  constructor(
    private readonly galleryRepository: GalleryRepository,
    private readonly galleryUrl: string,
  ) {}

  async execute(input: RestoreGalleryInput): Promise<AdminGalleryDto> {
    const gallery = await this.galleryRepository.findOwnedWithStats(
      input.id,
      input.userId,
    );
    if (!gallery) throw new AppError(DomainErrorCode.GALLERY_NOT_FOUND);
    if (gallery.trashedAt === null) {
      return galleryMapper.toAdminDto(gallery, this.galleryUrl);
    }

    const isExpired = gallery.expiresAt && gallery.expiresAt <= new Date();
    if (isExpired && input.expiresAt === undefined) {
      throw new AppError(DomainErrorCode.GALLERY_RESTORE_NEEDS_EXPIRY);
    }
    if (input.expiresAt && input.expiresAt <= new Date()) {
      throw new AppError(DomainErrorCode.GALLERY_EXPIRY_IN_PAST);
    }

    const expiresAt =
      input.expiresAt === undefined ? gallery.expiresAt : input.expiresAt;
    await this.galleryRepository.updateTrash(input.id, {
      trashedAt: null,
      expiresAt,
    });

    return galleryMapper.toAdminDto(
      {
        ...gallery,
        trashedAt: null,
        expiresAt,
      },
      this.galleryUrl,
    );
  }
}
