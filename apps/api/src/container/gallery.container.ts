import type { AppConfig } from '@config';
import type { AuthGuard } from '@modules/auth/index.ts';
import {
  CountGalleriesUseCase,
  CreateGalleryUseCase,
  DrizzleGalleryRepository,
  galleryRoutes,
  GetGalleryUseCase,
  ListGalleriesUseCase,
  RegenerateShareTokenUseCase,
  UpdateGalleryUseCase,
} from '@modules/gallery/index.ts';
import type { InfrastructureContainer } from './infrastructure.container.ts';

export function initGalleryContainer(
  config: AppConfig,
  infrastructure: InfrastructureContainer,
  authGuard: AuthGuard,
) {
  const galleryRepository = new DrizzleGalleryRepository(
    infrastructure.dbProvider,
  );

  const listGalleries = new ListGalleriesUseCase(galleryRepository);
  const countGalleries = new CountGalleriesUseCase(galleryRepository);
  const getGallery = new GetGalleryUseCase(
    galleryRepository,
    config.gallery.url,
  );
  const createGallery = new CreateGalleryUseCase(
    galleryRepository,
    infrastructure.tokenService,
    config.gallery.url,
  );
  const updateGallery = new UpdateGalleryUseCase(
    galleryRepository,
    config.gallery.url,
  );
  const regenerateShareToken = new RegenerateShareTokenUseCase(
    galleryRepository,
    infrastructure.tokenService,
    config.gallery.url,
  );

  const routes = galleryRoutes({
    listGalleries,
    countGalleries,
    getGallery,
    createGallery,
    updateGallery,
    regenerateShareToken,
    authGuard,
  });

  return { routes };
}
