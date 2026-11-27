import {
  DeleteObjectsCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  NotFound,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { chunk } from '@common/utils/chunk.ts';
import type {
  FileStorage,
  PresignDownloadInput,
  PresignUploadInput,
  StoredFile,
} from './file-storage.ts';

export interface S3FileStorageConfig {
  endpoint: string;
  region: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
  forcePathStyle: boolean;
}

export class S3FileStorage implements FileStorage {
  private static readonly UPLOAD_URL_TTL_SECONDS = 15 * 60;
  private static readonly DOWNLOAD_URL_TTL_SECONDS = 60 * 60;
  private static readonly DELETE_BATCH_SIZE = 1000;
  private static readonly SIGNED_UPLOAD_HEADERS = new Set([
    'content-type',
    'content-length',
  ]);

  private readonly client: S3Client;
  private readonly bucket: string;

  constructor(config: S3FileStorageConfig) {
    const credentials = {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    };
    this.client = new S3Client({
      endpoint: config.endpoint,
      region: config.region,
      credentials,
      forcePathStyle: config.forcePathStyle,
    });
    this.bucket = config.bucket;
  }

  async presignUpload(input: PresignUploadInput): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: input.key,
      ContentType: input.contentType,
      ContentLength: input.contentLength,
    });
    return getSignedUrl(this.client, command, {
      expiresIn: S3FileStorage.UPLOAD_URL_TTL_SECONDS,
      signableHeaders: S3FileStorage.SIGNED_UPLOAD_HEADERS,
    });
  }

  async presignDownload(input: PresignDownloadInput): Promise<string> {
    const contentDisposition = S3FileStorage.attachmentDisposition(
      input.downloadFileName,
    );
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: input.key,
      ResponseContentDisposition: contentDisposition,
    });
    return getSignedUrl(this.client, command, {
      expiresIn: S3FileStorage.DOWNLOAD_URL_TTL_SECONDS,
    });
  }

  async head(key: string): Promise<StoredFile | null> {
    const command = new HeadObjectCommand({ Bucket: this.bucket, Key: key });
    try {
      const output = await this.client.send(command);
      return {
        sizeBytes: output.ContentLength ?? 0,
        contentType: output.ContentType ?? null,
      };
    } catch (error) {
      if (error instanceof NotFound) return null;
      throw error;
    }
  }

  async delete(keys: string[]): Promise<void> {
    const batches = chunk(keys, S3FileStorage.DELETE_BATCH_SIZE);
    for (const batch of batches) {
      await this.deleteBatch(batch);
    }
  }

  async deletePrefix(prefix: string): Promise<void> {
    const command = new ListObjectsV2Command({
      Bucket: this.bucket,
      Prefix: prefix,
    });
    const page = await this.client.send(command);
    const objects = page.Contents ?? [];
    const keys = objects.flatMap((object) => (object.Key ? [object.Key] : []));
    if (keys.length === 0) return;

    await this.deleteBatch(keys);
    if (page.IsTruncated) await this.deletePrefix(prefix);
  }

  private async deleteBatch(keys: string[]): Promise<void> {
    const objects = keys.map((key) => ({ Key: key }));
    const command = new DeleteObjectsCommand({
      Bucket: this.bucket,
      Delete: { Objects: objects, Quiet: true },
    });
    await this.client.send(command);
  }

  private static attachmentDisposition(
    fileName: string | null,
  ): string | undefined {
    if (fileName === null) return undefined;
    const encodedName = encodeURIComponent(fileName);
    return `attachment; filename*=UTF-8''${encodedName}`;
  }
}
