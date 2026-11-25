import { GalleryApiRoutes, type AdminGalleryDto } from '@kadr/shared';
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import { AuthGuard } from '../../auth/guards/auth.guard.ts';
import  { CreateGalleryUseCase } from '../use-cases/create-gallery.use-case.ts';
import { createGalleryRouteSchema } from './gallery.schema.ts';

export interface GalleryRoutesOptions{
    createGalleryUseCase: CreateGalleryUseCase,
    authGuard: AuthGuard,
}

export function galleryRoutes(
    options: GalleryRoutesOptions,
): FastifyPluginCallbackZod {
    const {createGalleryUseCase, authGuard} = options;
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
                });
            }
        )
        done()
    }
}