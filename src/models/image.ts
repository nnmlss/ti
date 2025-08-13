export interface ImageSize {
  width: number;
  folder: string;
}

export interface ImagePaths {
  original: string;
  versions: Array<ImageSize & {
    path: string;
    relativePath: string;
  }>;
}

export interface ProcessedImage {
  original: {
    path: string;
    width?: number;
    height?: number;
    format?: string;
  };
  versions: Array<{
    size: string;
    path: string;
  }>;
}