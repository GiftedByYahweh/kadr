import { randomUUID } from 'node:crypto';
import {
  DomainErrorCode,
  GALLERY_MEDIA_MAX,
  PENDING_UPLOADS_MAX,
  type ImageContentType,
  type MediaUploadTargetDto,
} from '@kadr/shared';
import { AppError } from '@common/error/app.error.ts';
import type { FileStorage } from '@common/storage/file-storage.ts';
import {
  MediaArea,
  mediaStorageKeys,
} from '@common/storage/media-storage-keys.ts';
import type { UseCase } from '@common/use-case/use-case.ts';
import type {
  CreateGalleryMediaData,
  GalleryMediaRepository,
} from '../repositories/gallery-media.repository.ts';
import type { GalleryRepository } from '../repositories/gallery.repository.ts';

export interface StartMediaUploadsFile {
  name: string;
  contentType: ImageContentType;
  sizeBytes: number;
}

export interface StartMediaUploadsInput {
  galleryId: string;
  userId: string;
  files: StartMediaUploadsFile[];
}

export class StartMediaUploadsUseCase implements UseCase<
  StartMediaUploadsInput,
  MediaUploadTargetDto[]
> {
  private static readonly EXTENSION_BY_CONTENT_TYPE: Record<
    ImageContentType,
    string
  > = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
  };
  private static readonly NAME_COLLATOR = new Intl.Collator('en', {
    numeric: true,
  });

  constructor(
    private readonly galleryRepository: GalleryRepository,
    private readonly galleryMediaRepository: GalleryMediaRepository,
    private readonly fileStorage: FileStorage,
  ) {}

  async execute(
    input: StartMediaUploadsInput,
  ): Promise<MediaUploadTargetDto[]> {
    const gallery = await this.galleryRepository.findOwnedWithStats(
      input.galleryId,
      input.userId,
    );
    if (!gallery) throw new AppError(DomainErrorCode.GALLERY_NOT_FOUND);
    if (gallery.trashedAt !== null) {
      throw new AppError(DomainErrorCode.GALLERY_TRASHED);
    }
    await this.assertLimits(gallery.id, input.userId, input.files.length);

    const lastPosition = await this.galleryMediaRepository.findLastPosition(
      gallery.id,
    );
    const firstPosition = lastPosition === null ? 0 : lastPosition + 1;
    const media = this.buildMedia(input, firstPosition);
    await this.galleryMediaRepository.createUploading(media);

    return Promise.all(media.map((item) => this.uploadTarget(item)));
  }

  private async assertLimits(
    galleryId: string,
    userId: string,
    newCount: number,
  ) {
    const inGallery =
      await this.galleryMediaRepository.countInGallery(galleryId);
    if (inGallery + newCount > GALLERY_MEDIA_MAX) {
      throw new AppError(DomainErrorCode.GALLERY_MEDIA_LIMIT);
    }
    const uploading =
      await this.galleryMediaRepository.countUploadingByUser(userId);
    if (uploading + newCount > PENDING_UPLOADS_MAX) {
      throw new AppError(DomainErrorCode.PENDING_UPLOADS_LIMIT);
    }
  }

  private buildMedia(
    input: StartMediaUploadsInput,
    firstPosition: number,
  ): CreateGalleryMediaData[] {
    const prefix = mediaStorageKeys.areaPrefix(
      input.userId,
      MediaArea.GALLERIES,
      input.galleryId,
    );
    const byName = input.files.toSorted((a, b) =>
      StartMediaUploadsUseCase.NAME_COLLATOR.compare(a.name, b.name),
    );
    return input.files.map((file) => {
      const id = randomUUID();
      const extension =
        StartMediaUploadsUseCase.EXTENSION_BY_CONTENT_TYPE[file.contentType];
      return {
        id,
        galleryId: input.galleryId,
        originalName: file.name,
        storageKey: mediaStorageKeys.original(prefix, id, extension),
        contentType: file.contentType,
        sizeBytes: file.sizeBytes,
        position: firstPosition + byName.indexOf(file),
      };
    });
  }

  private async uploadTarget(
    media: CreateGalleryMediaData,
  ): Promise<MediaUploadTargetDto> {
    const uploadUrl = await this.fileStorage.presignUpload({
      key: media.storageKey,
      contentType: media.contentType,
      contentLength: media.sizeBytes,
    });
    return { mediaId: media.id, uploadUrl };
  }
}
