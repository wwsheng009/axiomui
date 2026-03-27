export type UploadFileStatus =
  | "queued"
  | "uploading"
  | "success"
  | "error"
  | "canceled";

export type UploadDropOperation = "copy" | "move" | "link";

export type UploadFileAction = "remove" | "retry";

export interface UploadFileItem {
  disabledActions?: UploadFileAction[];
  id: string;
  mediaType?: string;
  message?: string;
  name: string;
  progress?: number;
  size?: number;
  status: UploadFileStatus;
}

export interface UploadDropPayload {
  files: File[];
  operation: UploadDropOperation;
}
