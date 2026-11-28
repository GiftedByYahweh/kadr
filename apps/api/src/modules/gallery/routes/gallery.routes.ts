import { AdminApiRoutes } from '@kadr/shared';
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import { AuthGuard } from '@modules/auth/index.ts';
import {
  MEDIA_UPLOAD_CONFIRM_RATE_LIMIT,
  MEDIA_UPLOAD_START_RATE_LIMIT,
} from '../gallery.constants.ts';
import type { ConfirmMediaUploadsUseCase } from '../use-cases/confirm-media-uploads.use-case.ts';
import type { CountGalleriesUseCase } from '../use-cases/count-galleries.use-case.ts';
import type { CreateGalleryUseCase } from '../use-cases/create-gallery.use-case.ts';
import type { DeleteGalleryUseCase } from '../use-cases/delete-gallery.use-case.ts';
import type { GetGalleryUseCase } from '../use-cases/get-gallery.use-case.ts';
import type { ListGalleriesUseCase } from '../use-cases/list-galleries.use-case.ts';
import type { RegenerateShareTokenUseCase } from '../use-cases/regenerate-share-token.use-case.ts';
import type { StartMediaUploadsUseCase } from '../use-cases/start-media-uploads.use-case.ts';
import type { RestoreGalleryUseCase } from '../use-cases/restore-gallery.use-case.ts';
import type { TrashGalleryUseCase } from '../use-cases/trash-gallery.use-case.ts';
import type { UpdateGalleryUseCase } from '../use-cases/update-gallery.use-case.ts';
import { galleryRouteSchemas } from './gallery.schema.ts';

export interface GalleryRoutesOptions {
  listGalleries: ListGalleriesUseCase;
  countGalleries: CountGalleriesUseCase;
  getGallery: GetGalleryUseCase;
  createGallery: CreateGalleryUseCase;
  updateGallery: UpdateGalleryUseCase;
  regenerateShareToken: RegenerateShareTokenUseCase;
  trashGallery: TrashGalleryUseCase;
  restoreGallery: RestoreGalleryUseCase;
  deleteGallery: DeleteGalleryUseCase;
  startMediaUploads: StartMediaUploadsUseCase;
  confirmMediaUploads: ConfirmMediaUploadsUseCase;
  authGuard: AuthGuard;
}

type GalleryServer = Parameters<FastifyPluginCallbackZod>[0];
type Guard = AuthGuard['handle'];

export function galleryRoutes(
  options: GalleryRoutesOptions,
): FastifyPluginCallbackZod {
  const guard = options.authGuard.handle.bind(options.authGuard);

  return (server, _pluginOptions, done) => {
    registerReadRoutes(server, options, guard);
    registerSettingsRoutes(server, options, guard);
    registerTrashRoutes(server, options, guard);
    registerMediaRoutes(server, options, guard);
    done();
  };
}

function registerReadRoutes(
  server: GalleryServer,
  options: GalleryRoutesOptions,
  guard: Guard,
) {
  server.get(
    AdminApiRoutes.galleries.list,
    { onRequest: guard, schema: galleryRouteSchemas.list },
    async (request) => {
      const auth = AuthGuard.getAuth(request);
      return options.listGalleries.execute({
        ...request.query,
        userId: auth.userId,
      });
    },
  );

  server.get(
    AdminApiRoutes.galleries.counts,
    { onRequest: guard },
    async (request) => {
      const auth = AuthGuard.getAuth(request);
      return options.countGalleries.execute({ userId: auth.userId });
    },
  );

  server.get(
    AdminApiRoutes.galleries.byId,
    { onRequest: guard, schema: galleryRouteSchemas.byId },
    async (request) => {
      const auth = AuthGuard.getAuth(request);
      return options.getGallery.execute({
        id: request.params.id,
        userId: auth.userId,
      });
    },
  );
}

function registerSettingsRoutes(
  server: GalleryServer,
  options: GalleryRoutesOptions,
  guard: Guard,
) {
  server.post(
    AdminApiRoutes.galleries.list,
    { onRequest: guard, schema: galleryRouteSchemas.create },
    async (request) => {
      const auth = AuthGuard.getAuth(request);
      return options.createGallery.execute({
        ...request.body,
        userId: auth.userId,
      });
    },
  );

  server.patch(
    AdminApiRoutes.galleries.byId,
    { onRequest: guard, schema: galleryRouteSchemas.update },
    async (request) => {
      const auth = AuthGuard.getAuth(request);
      return options.updateGallery.execute({
        ...request.body,
        id: request.params.id,
        userId: auth.userId,
      });
    },
  );

  server.post(
    AdminApiRoutes.galleries.shareToken,
    { onRequest: guard, schema: galleryRouteSchemas.byId },
    async (request) => {
      const auth = AuthGuard.getAuth(request);
      return options.regenerateShareToken.execute({
        id: request.params.id,
        userId: auth.userId,
      });
    },
  );
}

function registerTrashRoutes(
  server: GalleryServer,
  options: GalleryRoutesOptions,
  guard: Guard,
) {
  server.post(
    AdminApiRoutes.galleries.trash,
    { onRequest: guard, schema: galleryRouteSchemas.byId },
    async (request) => {
      const auth = AuthGuard.getAuth(request);
      return options.trashGallery.execute({
        id: request.params.id,
        userId: auth.userId,
      });
    },
  );

  server.post(
    AdminApiRoutes.galleries.restore,
    { onRequest: guard, schema: galleryRouteSchemas.restore },
    async (request) => {
      const auth = AuthGuard.getAuth(request);
      return options.restoreGallery.execute({
        ...request.body,
        id: request.params.id,
        userId: auth.userId,
      });
    },
  );

  server.delete(
    AdminApiRoutes.galleries.byId,
    { onRequest: guard, schema: galleryRouteSchemas.delete },
    async (request) => {
      const auth = AuthGuard.getAuth(request);
      await options.deleteGallery.execute({
        ...request.query,
        id: request.params.id,
        userId: auth.userId,
      });
      return null;
    },
  );
}

function registerMediaRoutes(
  server: GalleryServer,
  options: GalleryRoutesOptions,
  guard: Guard,
) {
  server.post(
    AdminApiRoutes.galleries.mediaUploads,
    {
      onRequest: guard,
      schema: galleryRouteSchemas.startMediaUploads,
      config: { rateLimit: MEDIA_UPLOAD_START_RATE_LIMIT },
    },
    async (request) => {
      const auth = AuthGuard.getAuth(request);
      return options.startMediaUploads.execute({
        galleryId: request.params.id,
        userId: auth.userId,
        files: request.body.files,
      });
    },
  );

  server.post(
    AdminApiRoutes.galleries.media,
    {
      onRequest: guard,
      schema: galleryRouteSchemas.confirmMediaUploads,
      config: { rateLimit: MEDIA_UPLOAD_CONFIRM_RATE_LIMIT },
    },
    async (request) => {
      const auth = AuthGuard.getAuth(request);
      return options.confirmMediaUploads.execute({
        galleryId: request.params.id,
        userId: auth.userId,
        mediaIds: request.body.mediaIds,
      });
    },
  );
}
