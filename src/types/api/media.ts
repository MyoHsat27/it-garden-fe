export enum MediaType {
  IMAGE = "image",
  VIDEO = "video",
  DOCUMENT = "document",
  ARCHIVE = "archive",
}

export interface Media {
  id: number;
  url: string;
  type: MediaType;
  mimeType: string;
  altText: string;
}
