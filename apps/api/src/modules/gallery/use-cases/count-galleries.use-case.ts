import type { AdminGalleryCountsDto } from '@kadr/shared';
import type { UseCase } from '@common/use-case/use-case.ts';
import { galleryMapper } from '../mappers/gallery.mapper.ts';
import type { GalleryRepository } from '../repositories/gallery.repository.ts';

export interface CountGalleriesInput {
  userId: string;
}

export class CountGalleriesUseCase implements UseCase<
  CountGalleriesInput,
  AdminGalleryCountsDto
> {
  constructor(private readonly galleryRepository: GalleryRepository) {}

  async execute(input: CountGalleriesInput): Promise<AdminGalleryCountsDto> {
    const counts = await this.galleryRepository.countByStatus(input.userId);
    return galleryMapper.toAdminCountsDto(counts);
  }
}
