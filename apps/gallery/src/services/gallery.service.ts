import type { ClientGalleryDto } from '@kadr/shared';
import galleryMock from '../mocks/gallery.json';

export function fetchGallery(): Promise<ClientGalleryDto> {
  const gallery: ClientGalleryDto = galleryMock;
  return Promise.resolve(structuredClone(gallery));
}
