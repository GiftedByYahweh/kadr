import type { AppConfig } from '@config';
import { CreateGalleryUseCase, galleryRoutes} from '@modules/gallery/index.ts';
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

  const routes = galleryRoutes({
    createGalleryUseCase: createGallery,
    authGuard: authGuard,
  })
  return { 
    createGallery, 
    routes,
  };
}

export type GalleryContainer = ReturnType<typeof initGalleryContainer>;