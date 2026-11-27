import type { AdminGalleryListPageDto, ListGalleriesQuery } from '@kadr/shared';
import { pagination } from '@common/utils/pagination.ts';
import type { UseCase } from '@common/use-case/use-case.ts';
import { galleryMapper } from '../mappers/gallery.mapper.ts';
import type { GalleryRepository } from '../repositories/gallery.repository.ts';

export interface ListGalleriesInput extends ListGalleriesQuery {
  userId: string;
}

export class ListGalleriesUseCase implements UseCase<
  ListGalleriesInput,
  AdminGalleryListPageDto
> {
  constructor(private readonly galleryRepository: GalleryRepository) {}

  async execute(input: ListGalleriesInput): Promise<AdminGalleryListPageDto> {
    const window = pagination.window(input.page, input.pageSize);
    const galleries = await this.galleryRepository.listWithStats({
      userId: input.userId,
      trashed: input.trashed,
      search: input.search,
      limit: window.limit,
      offset: window.offset,
    });

    const page = pagination.slice(galleries, input.pageSize);
    const items = page.items.map((gallery) =>
      galleryMapper.toAdminListItemDto(gallery),
    );
    return { items, hasNextPage: page.hasNextPage };
  }
}
