import { GalleryApiRoutes, type AdminGalleryDto, type AdminGalleryListItemDto  } from '@kadr/shared';
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import { AuthGuard } from '../../auth/guards/auth.guard.ts';
import  { CreateGalleryUseCase } from '../use-cases/create-gallery.use-case.ts';
import { ListGalleryUseCase } from '../use-cases/list-galleries.use-case.ts';
import { createGalleryRouteSchema, listGalleriesRouteSchema } from './gallery.schema.ts';

export interface GalleryRoutesOptions{
    createGalleryUseCase: CreateGalleryUseCase,
    authGuard: AuthGuard,
    listGalleriesUseCase: ListGalleryUseCase,
}

export function galleryRoutes(
    options: GalleryRoutesOptions,
): FastifyPluginCallbackZod {
    const {createGalleryUseCase, authGuard, listGalleriesUseCase} = options;
    const guard = authGuard.handle.bind(authGuard);

    return (server, _pluginOptions, done) => { 
        server.post(
            GalleryApiRoutes.create,
            {
                schema: createGalleryRouteSchema,
                onRequest: guard,
            },
            async (request): Promise<AdminGalleryDto> => {
                const auth = AuthGuard.getAuth(request);

                return createGalleryUseCase.execute({
                    userId: auth.userId, 
                    title: request.body.title,
                    includedCount: request.body.includedCount,
                    extraPrice: request.body.extraPrice,
                    expiresAt: request.body.expiresAt ? new Date(request.body.expiresAt): null,
                },
            );
            
            }
        ),
        server.get(
                GalleryApiRoutes.list,
                {
                    schema: listGalleriesRouteSchema,
                    onRequest: guard,
                },
                async(request): Promise<AdminGalleryListItemDto[]> => {
                    const auth = AuthGuard.getAuth(request);
                    return listGalleriesUseCase.execute({
                        userId: auth.userId,
                        ...(request.query.status ? { status: request.query.status } : {}),
                    });
                },
            );
        done()
    }
}