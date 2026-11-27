import { DomainErrorCode, type AdminGalleryDto } from '@kadr/shared';
import { AppError } from '@common/error/app.error.ts';
import type { UseCase } from '@common/use-case/use-case.ts';
import { galleryMapper } from '../mappers/gallery.mapper.ts';
import type { GalleryRepository } from '../repositories/gallery.repository.ts';

export interface GetGalleryInput {
  id: string;
  userId: string;
}

export class GetGalleryUseCase implements UseCase<
  GetGalleryInput,
  AdminGalleryDto
> {
  constructor(
    private readonly galleryRepository: GalleryRepository,
    private readonly galleryUrl: string,
  ) {}

  async execute(input: GetGalleryInput): Promise<AdminGalleryDto> {
    const gallery = await this.galleryRepository.findOwnedWithStats(
      input.id,
      input.userId,
    );
    if (gallery === null) throw new AppError(DomainErrorCode.GALLERY_NOT_FOUND);
    return galleryMapper.toAdminDto(gallery, this.galleryUrl);
  }
}
