import { GalleryStatus, type AdminGalleryListItemDto } from "@kadr/shared";
import type { UseCase } from "@common/use-case/use-case";
import { galleryMapper } from "../mapper/gallery.mapper";
import type { GalleryRepository } from "../repositories/gallery.repository";

export interface ListGalleriesInput {
    userId: string;
    status?: GalleryStatus;
}

export class ListGalleryUseCase implements UseCase <
ListGalleriesInput,
AdminGalleryListItemDto[]
> {
    constructor(
        private readonly galleryRepositories: GalleryRepository,
    ) {}

    async execute(input: ListGalleriesInput): Promise<AdminGalleryListItemDto[]> {
        const galleries = await this.galleryRepositories.findManyByUserId(
            input.userId,
            input.status,
        );
        return galleries.map((gallery)=> galleryMapper.toListAdminDto(gallery))
    }
}