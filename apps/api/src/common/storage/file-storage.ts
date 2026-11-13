export interface PresignUploadInput {
  key: string;
  contentType: string;
  contentLength: number;
}

export interface PresignDownloadInput {
  key: string;
  downloadFileName: string | null;
}

export interface FileStorage {
  presignUpload(input: PresignUploadInput): Promise<string>;
  presignDownload(input: PresignDownloadInput): Promise<string>;
  delete(keys: string[]): Promise<void>;
}
