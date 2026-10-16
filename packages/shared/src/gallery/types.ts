export interface ClientGalleryCommentDto {
  id: string;
  text: string;
  createdAt: string;
}

export interface ClientGalleryMediaDto {
  id: string;
  originalName: string;
  previewUrl: string;
  width: number;
  height: number;
  likedAt: string | null;
  comments: ClientGalleryCommentDto[];
}

export interface ClientGalleryDto {
  title: string;
  subtitle: string;
  coverUrl: string;
  includedCount: number;
  extraPrice: number;
  media: ClientGalleryMediaDto[];
}
