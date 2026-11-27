import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/vue-query';
import { computed, type Ref } from 'vue';
import { galleriesService } from '@/modules/gallery/services/galleries.service.ts';

const GALLERIES_KEY = 'galleries';
const GALLERY_PAGE_SIZE = 24;
const FIRST_PAGE = 1;

const galleryQueryKeys = {
  all: [GALLERIES_KEY],
  list: (trashed: boolean, search: string) => [
    GALLERIES_KEY,
    'list',
    trashed,
    search,
  ],
  counts: [GALLERIES_KEY, 'counts'],
  details: (id: string) => [GALLERIES_KEY, 'details', id],
};

export function useGalleryList(trashed: Ref<boolean>, search: Ref<string>) {
  return useInfiniteQuery({
    queryKey: computed(() =>
      galleryQueryKeys.list(trashed.value, search.value),
    ),
    queryFn: ({ pageParam }) =>
      galleriesService.list({
        trashed: trashed.value,
        search: search.value,
        page: pageParam,
        pageSize: GALLERY_PAGE_SIZE,
      }),
    initialPageParam: FIRST_PAGE,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasNextPage ? allPages.length + 1 : undefined,
    placeholderData: keepPreviousData,
  });
}

export function useGalleryCounts() {
  return useQuery({
    queryKey: galleryQueryKeys.counts,
    queryFn: galleriesService.counts,
  });
}

export function useGallery(id: Ref<string>) {
  return useQuery({
    queryKey: computed(() => galleryQueryKeys.details(id.value)),
    queryFn: () => galleriesService.get(id.value),
    retry: false,
  });
}

export function useGalleryMutation<TInput, TResult>(
  mutationFn: (input: TInput) => Promise<TResult>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: galleryQueryKeys.all });
    },
  });
}
