import {
  DomainErrorCode,
  MediaStatus,
  type AdminGalleryMediaDto,
} from '@kadr/shared';
import { AppError } from '@common/error/app.error.ts';
import type { FileStorage } from '@common/storage/file-storage.ts';
import type { UseCase } from '@common/use-case/use-case.ts';
import type { GalleryMedia } from '../entities/gallery-media.entity.ts';
import { galleryMediaMapper } from '../mappers/gallery-media.mapper.ts';
import type { GalleryMediaRepository } from '../repositories/gallery-media.repository.ts';
import type { GalleryRepository } from '../repositories/gallery.repository.ts';

export interface ConfirmMediaUploadsInput {
  galleryId: string;
  userId: string;
  mediaIds: string[];
}

export class ConfirmMediaUploadsUseCase implements UseCase<
  ConfirmMediaUploadsInput,
  AdminGalleryMediaDto[]
> {
  constructor(
    private readonly galleryRepository: GalleryRepository,
    private readonly galleryMediaRepository: GalleryMediaRepository,
    private readonly fileStorage: FileStorage,
  ) {}

  async execute(
    input: ConfirmMediaUploadsInput,
  ): Promise<AdminGalleryMediaDto[]> {
    const gallery = await this.galleryRepository.findOwnedWithStats(
      input.galleryId,
      input.userId,
    );
    if (!gallery) throw new AppError(DomainErrorCode.GALLERY_NOT_FOUND);
    if (gallery.trashedAt !== null) {
      throw new AppError(DomainErrorCode.GALLERY_TRASHED);
    }

    const mediaIds = new Set(input.mediaIds);
    const media = await this.galleryMediaRepository.findInGallery(gallery.id, [
      ...mediaIds,
    ]);
    if (media.length !== mediaIds.size) {
      throw new AppError(DomainErrorCode.MEDIA_UPLOAD_NOT_FOUND);
    }

    await this.confirmUploading(media);

    return media.map((item) => {
      const confirmed = ConfirmMediaUploadsUseCase.afterConfirm(item);
      return galleryMediaMapper.toAdminDto(confirmed);
    });
  }

  private async confirmUploading(media: GalleryMedia[]) {
    const uploading = media.filter(
      (item) => item.status === MediaStatus.UPLOADING,
    );
    if (uploading.length === 0) return;

    await Promise.all(uploading.map((item) => this.assertUploaded(item)));
    const uploadingIds = uploading.map((item) => item.id);
    await this.galleryMediaRepository.markProcessing(uploadingIds);
  }

  private async assertUploaded(media: GalleryMedia) {
    const file = await this.fileStorage.head(media.storageKey);
    if (file?.sizeBytes !== media.sizeBytes) {
      throw new AppError(DomainErrorCode.MEDIA_UPLOAD_NOT_FOUND);
    }
  }

  private static afterConfirm(media: GalleryMedia): GalleryMedia {
    if (media.status !== MediaStatus.UPLOADING) return media;
    return { ...media, status: MediaStatus.PROCESSING };
  }
}
