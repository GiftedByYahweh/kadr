import type { AppConfig } from '@config';
import { CreateGalleryUseCase, galleryRoutes, ListGalleryUseCase} from '@modules/gallery/index.ts';
import type { AuthGuard } from '@modules/auth/index.ts';
import type { InfrastructureContainer } from './infrastructure.container.ts';
import type { Repositories } from './repositories.container.ts';

export function initGalleryContainer(
  config: AppConfig,
  repositories: Repositories,
  infrastructure: InfrastructureContainer,
  authGuard: AuthGuard,
) {
  const createGallery = new CreateGalleryUseCase(
    repositories.gallery,
    config.galleryUrl,
    infrastructure.tokenService,
  );

  const listGalleries = new ListGalleryUseCase(
    repositories.gallery
  );

  const routes = galleryRoutes({
    createGalleryUseCase: createGallery,
    authGuard: authGuard,
    listGalleriesUseCase: listGalleries, 
  })
  return { 
    createGallery, 
    routes,
    listGalleries,
  };
}

export type GalleryContainer = ReturnType<typeof initGalleryContainer>;