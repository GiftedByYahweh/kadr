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
  selectionSubmittedAt: string | null;
  media: ClientGalleryMediaDto[];
}
export interface AdminGalleryDto {
  id: string;
  title: string;
  status: string;
  expiresAt: string | null;
  trashedAt: string | null;
  createdAt: string;
  mediaCount: number;
  likedCount: number;
  coverUrl: string | null;
  includedCount: number;
  extraPrice: number;
  selectionSubmittedAt: string | null;
  shareUrl: string;
}
export interface AdminGalleryListItemDto {
  id: string;
  title: string;
  status: string;
  expiresAt: string | null;
  trashedAt: string | null;
  createdAt: string;
  mediaCount: number;
  likedCount: number;
  coverUrl: string | null;
}