export interface PolicyUpdateMetadata {
  text: string;
  documentId: string;
  organizationId: string;
  fileName: string;
}

export interface PolicySearchResult {
  id: string;
  score: number;
  metadata: PolicyUpdateMetadata;
}

export interface PolicyExecuteResponse {
  message: string;
  updatedText: string;
}
