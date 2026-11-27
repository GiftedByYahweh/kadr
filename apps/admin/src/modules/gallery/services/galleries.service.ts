import {
  AdminApiRoutes,
  DomainErrorCode,
  type AdminGalleryCountsDto,
  type AdminGalleryDto,
  type AdminGalleryListPageDto,
  type ApiResponse,
} from '@kadr/shared';
import { http } from '@kadr/shared/http';
import { GENERIC_ERROR_MESSAGE } from '@/shared/services/error-messages.ts';
import type {
  DeleteGalleryInput,
  GalleryListQuery,
  GallerySettingsInput,
  RestoreGalleryInput,
  UpdateGalleryInput,
} from './galleries.types.ts';

const ID_PARAM = ':id';

const GALLERY_ERROR_MESSAGES: Partial<Record<number, string>> = {
  [DomainErrorCode.GALLERY_NOT_FOUND]: 'Галерею не знайдено',
  [DomainErrorCode.GALLERY_TRASHED]: 'Галерея в кошику',
  [DomainErrorCode.GALLERY_RESTORE_NEEDS_EXPIRY]:
    'Доступ уже закінчився, оберіть новий термін',
  [DomainErrorCode.GALLERY_TITLE_MISMATCH]: 'Назва не збігається',
  [DomainErrorCode.GALLERY_EXPIRY_IN_PAST]: 'Дата доступу вже минула',
};

function unwrap<T>(response: ApiResponse<T>): T {
  if (response.success) return response.data;
  const message =
    GALLERY_ERROR_MESSAGES[response.code] ?? GENERIC_ERROR_MESSAGE;
  throw new Error(message);
}

function listUrl(query: GalleryListQuery): string {
  const params = new URLSearchParams({
    trashed: String(query.trashed),
    page: String(query.page),
    pageSize: String(query.pageSize),
  });
  const search = query.search.trim();
  if (search !== '') params.set('search', search);
  return `${AdminApiRoutes.galleries.list}?${params.toString()}`;
}

export const galleriesService = {
  list: async (query: GalleryListQuery): Promise<AdminGalleryListPageDto> =>
    unwrap(await http.get<AdminGalleryListPageDto>(listUrl(query))),

  counts: async (): Promise<AdminGalleryCountsDto> =>
    unwrap(
      await http.get<AdminGalleryCountsDto>(AdminApiRoutes.galleries.counts),
    ),

  get: async (id: string): Promise<AdminGalleryDto> =>
    unwrap(
      await http.get<AdminGalleryDto>(
        AdminApiRoutes.galleries.byId.replace(ID_PARAM, id),
      ),
    ),

  create: async (input: GallerySettingsInput): Promise<AdminGalleryDto> =>
    unwrap(
      await http.post<AdminGalleryDto>(AdminApiRoutes.galleries.list, input),
    ),

  update: async (input: UpdateGalleryInput): Promise<AdminGalleryDto> =>
    unwrap(
      await http.patch<AdminGalleryDto>(
        AdminApiRoutes.galleries.byId.replace(ID_PARAM, input.id),
        input.settings,
      ),
    ),

  trash: async (id: string): Promise<AdminGalleryDto> =>
    unwrap(
      await http.post<AdminGalleryDto>(
        AdminApiRoutes.galleries.trash.replace(ID_PARAM, id),
      ),
    ),

  restore: async (input: RestoreGalleryInput): Promise<AdminGalleryDto> => {
    const body =
      input.expiresAt === undefined ? {} : { expiresAt: input.expiresAt };
    return unwrap(
      await http.post<AdminGalleryDto>(
        AdminApiRoutes.galleries.restore.replace(ID_PARAM, input.id),
        body,
      ),
    );
  },

  regenerateShareToken: async (id: string): Promise<AdminGalleryDto> =>
    unwrap(
      await http.post<AdminGalleryDto>(
        AdminApiRoutes.galleries.shareToken.replace(ID_PARAM, id),
      ),
    ),

  delete: async (input: DeleteGalleryInput): Promise<void> => {
    const params = new URLSearchParams({ confirmTitle: input.confirmTitle });
    const path = AdminApiRoutes.galleries.byId.replace(ID_PARAM, input.id);
    unwrap(await http.delete<null>(`${path}?${params.toString()}`));
  },
};
