import { DomainErrorCode, type DeleteGalleryQuery } from '@kadr/shared';
import { AppError } from '@common/error/app.error.ts';
import type { FileStorage } from '@common/storage/file-storage.ts';
import {
  MediaArea,
  mediaStorageKeys,
} from '@common/storage/media-storage-keys.ts';
import type { UseCase } from '@common/use-case/use-case.ts';
import type { GalleryRepository } from '../repositories/gallery.repository.ts';

export interface DeleteGalleryInput extends DeleteGalleryQuery {
  id: string;
  userId: string;
}

export class DeleteGalleryUseCase implements UseCase<DeleteGalleryInput, void> {
  constructor(
    private readonly galleryRepository: GalleryRepository,
    private readonly fileStorage: FileStorage,
  ) {}

  async execute(input: DeleteGalleryInput) {
    const gallery = await this.galleryRepository.findOwnedWithStats(
      input.id,
      input.userId,
    );
    if (!gallery) throw new AppError(DomainErrorCode.GALLERY_NOT_FOUND);
    if (gallery.title !== input.confirmTitle) {
      throw new AppError(DomainErrorCode.GALLERY_TITLE_MISMATCH);
    }

    await this.galleryRepository.delete(input.id);
    const prefix = mediaStorageKeys.areaPrefix(
      gallery.userId,
      MediaArea.GALLERIES,
      gallery.id,
    );
    await this.fileStorage.deletePrefix(prefix);
  }
}
