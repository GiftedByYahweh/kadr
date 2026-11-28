import type { AppConfig } from '@config';
import type { AuthGuard } from '@modules/auth/index.ts';
import {
  ConfirmMediaUploadsUseCase,
  CountGalleriesUseCase,
  CreateGalleryUseCase,
  DeleteGalleryUseCase,
  DrizzleGalleryMediaRepository,
  DrizzleGalleryRepository,
  galleryRoutes,
  GetGalleryUseCase,
  ListGalleriesUseCase,
  RegenerateShareTokenUseCase,
  RestoreGalleryUseCase,
  StartMediaUploadsUseCase,
  TrashGalleryUseCase,
  UpdateGalleryUseCase,
} from '@modules/gallery/index.ts';
import type { GalleryRepository } from '@modules/gallery/index.ts';
import type { InfrastructureContainer } from './infrastructure.container.ts';

function initMediaUseCases(
  infrastructure: InfrastructureContainer,
  galleryRepository: GalleryRepository,
) {
  const galleryMediaRepository = new DrizzleGalleryMediaRepository(
    infrastructure.dbProvider,
  );
  const startMediaUploads = new StartMediaUploadsUseCase(
    galleryRepository,
    galleryMediaRepository,
    infrastructure.fileStorage,
  );
  const confirmMediaUploads = new ConfirmMediaUploadsUseCase(
    galleryRepository,
    galleryMediaRepository,
    infrastructure.fileStorage,
  );
  return { startMediaUploads, confirmMediaUploads };
}

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
  const trashGallery = new TrashGalleryUseCase(
    galleryRepository,
    config.gallery.url,
  );
  const restoreGallery = new RestoreGalleryUseCase(
    galleryRepository,
    config.gallery.url,
  );
  const deleteGallery = new DeleteGalleryUseCase(
    galleryRepository,
    infrastructure.fileStorage,
  );

  const { startMediaUploads, confirmMediaUploads } = initMediaUseCases(
    infrastructure,
    galleryRepository,
  );

  const routes = galleryRoutes({
    listGalleries,
    countGalleries,
    getGallery,
    createGallery,
    updateGallery,
    regenerateShareToken,
    trashGallery,
    restoreGallery,
    deleteGallery,
    startMediaUploads,
    confirmMediaUploads,
    authGuard,
  });

  return { routes };
}
