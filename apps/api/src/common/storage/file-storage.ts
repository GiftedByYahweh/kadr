export interface PresignUploadInput {
  key: string;
  contentType: string;
  contentLength: number;
}

export interface PresignDownloadInput {
  key: string;
  downloadFileName: string | null;
}

export interface StoredFile {
  sizeBytes: number;
  contentType: string | null;
}

export interface FileStorage {
  presignUpload(input: PresignUploadInput): Promise<string>;
  presignDownload(input: PresignDownloadInput): Promise<string>;
  head(key: string): Promise<StoredFile | null>;
  delete(keys: string[]): Promise<void>;
  deletePrefix(prefix: string): Promise<void>;
}
