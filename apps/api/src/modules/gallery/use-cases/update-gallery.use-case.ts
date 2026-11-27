import {
  DomainErrorCode,
  type AdminGalleryDto,
  type UpdateGalleryRequest,
} from '@kadr/shared';
import { AppError } from '@common/error/app.error.ts';
import type { UseCase } from '@common/use-case/use-case.ts';
import { galleryMapper } from '../mappers/gallery.mapper.ts';
import type { GalleryRepository } from '../repositories/gallery.repository.ts';

export interface UpdateGalleryInput extends UpdateGalleryRequest {
  id: string;
  userId: string;
}

export class UpdateGalleryUseCase implements UseCase<
  UpdateGalleryInput,
  AdminGalleryDto
> {
  constructor(
    private readonly galleryRepository: GalleryRepository,
    private readonly galleryUrl: string,
  ) {}

  async execute(input: UpdateGalleryInput): Promise<AdminGalleryDto> {
    const current = await this.galleryRepository.findOwnedWithStats(
      input.id,
      input.userId,
    );
    if (!current) throw new AppError(DomainErrorCode.GALLERY_NOT_FOUND);
    if (current.trashedAt !== null) {
      throw new AppError(DomainErrorCode.GALLERY_TRASHED);
    }
    if (input.expiresAt && input.expiresAt <= new Date()) {
      throw new AppError(DomainErrorCode.GALLERY_EXPIRY_IN_PAST);
    }

    await this.galleryRepository.update(input.id, {
      title: input.title,
      expiresAt: input.expiresAt,
      includedCount: input.includedCount,
      extraPrice: input.extraPrice,
      currency: input.currency,
    });

    const updated = await this.galleryRepository.findOwnedWithStats(
      input.id,
      input.userId,
    );
    if (!updated) throw new AppError(DomainErrorCode.GALLERY_NOT_FOUND);
    return galleryMapper.toAdminDto(updated, this.galleryUrl);
  }
}
