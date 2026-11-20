import { AdminApiRoutes } from '@kadr/shared';
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import { AuthGuard } from '@modules/auth/index.ts';
import type { CountGalleriesUseCase } from '../use-cases/count-galleries.use-case.ts';
import type { GetGalleryUseCase } from '../use-cases/get-gallery.use-case.ts';
import type { ListGalleriesUseCase } from '../use-cases/list-galleries.use-case.ts';
import { galleryRouteSchemas } from './gallery.schema.ts';

export interface GalleryRoutesOptions {
  listGalleries: ListGalleriesUseCase;
  countGalleries: CountGalleriesUseCase;
  getGallery: GetGalleryUseCase;
  authGuard: AuthGuard;
}

export function galleryRoutes(
  options: GalleryRoutesOptions,
): FastifyPluginCallbackZod {
  const { listGalleries, countGalleries, getGallery, authGuard } = options;
  const guard = authGuard.handle.bind(authGuard);

  return (server, _pluginOptions, done) => {
    server.get(
      AdminApiRoutes.galleries.list,
      { onRequest: guard, schema: galleryRouteSchemas.list },
      async (request) => {
        const auth = AuthGuard.getAuth(request);
        return listGalleries.execute({ ...request.query, userId: auth.userId });
      },
    );

    server.get(
      AdminApiRoutes.galleries.counts,
      { onRequest: guard },
      async (request) => {
        const auth = AuthGuard.getAuth(request);
        return countGalleries.execute({ userId: auth.userId });
      },
    );

    server.get(
      AdminApiRoutes.galleries.byId,
      { onRequest: guard, schema: galleryRouteSchemas.byId },
      async (request) => {
        const auth = AuthGuard.getAuth(request);
        return getGallery.execute({
          id: request.params.id,
          userId: auth.userId,
        });
      },
    );

    done();
  };
}
