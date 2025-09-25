// ===== IMAGE SERVICE TYPES =====
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

// ===== NODE.JS ERROR TYPES =====
export interface NodeError extends Error {
  code?: string;
  errno?: number;
  path?: string;
  syscall?: string;
}

// ===== TEST MOCK TYPES =====
export interface MockSharpInstance {
  metadata: () => Promise<{ width: number; height: number; format: string }>;
  resize: (width: number, height: number) => MockSharpInstance;
  jpeg: (options: { quality: number }) => MockSharpInstance;
  toFile: (path: string) => Promise<void>;
}