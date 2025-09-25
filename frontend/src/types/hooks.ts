// ===== HOOK TYPES =====

// useConfirmDialog hook types
export interface ConfirmDialogState {
  isOpen: boolean;
  targetId: number | null;
  confirm: (id: number, action: () => void | Promise<void>) => void;
  handleConfirm: () => void;
  handleCancel: () => void;
}

// useModal hook types
export interface ModalState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  handleClose: () => void;
}

// useLocalStorage hook types
export interface LocalStorageHook<T> {
  value: T;
  setValue: (value: T | ((prev: T) => T)) => void;
  removeValue: () => void;
  hasValue: boolean;
}

// useImmediateAsync hook types
export interface UseImmediateAsyncOptions {
  /** Called when the async operation throws an error */
  onError?: (error: Error) => void;
  /** Called when the async operation completes successfully */
  onSuccess?: () => void;
  /** Optional Redux loading state to combine with local state */
  externalLoading?: boolean;
}

export interface UseImmediateAsyncReturn {
  /** Execute an async operation with immediate loading feedback */
  execute: (asyncFn: () => Promise<void>) => Promise<void>;
  /** True if the operation is currently running (local + external state) */
  isLoading: boolean;
  /** True if the operation is running (local state only) */
  isLocalLoading: boolean;
  /** Error from the last operation, if any */
  error: Error | null;
  /** Reset the error state */
  clearError: () => void;
}

// useCsrfToken hook types
export interface CsrfResponse {
  csrfToken: string;
}