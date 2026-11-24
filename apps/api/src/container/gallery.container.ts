import type { AppConfig } from '@config';
import { CreateGalleryUseCase } from '@modules/gallery/index.ts';
import type { Repositories } from './repositories.container.ts';

export function initGalleryContainer(
  config: AppConfig,
  repositories: Repositories,
) {
  const createGallery = new CreateGalleryUseCase(
    repositories.gallery,
    config.galleryUrl,
  );

  return { 
    createGallery, 
  };
}

export type GalleryContainer = ReturnType<typeof initGalleryContainer>;