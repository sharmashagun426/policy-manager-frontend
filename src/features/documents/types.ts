export type DocumentStatus = "processing" | "ready" | "failed";

export interface OrgDocument {
  id: string;
  fileName: string;
  title: string;
  category: string;
  pages: number;
  sizeKb: number;
  status: DocumentStatus;
  uploadedBy: string;
  uploadedAt: string;
  failReason?: string;
}

export interface IndexResponse {
  status: string;
  fileId: string;
  fileName: string;
  message: string;
}

export interface DocumentStatusResponse {
  status: "Processing" | "Ready" | "Failed";
  fileName: string;
  storagePath: string | null;
  chunks: number;
  error: string | null;
}
