export interface Citation {
  id: string;
  documentId: string;
  documentTitle: string;
  page: number;
  snippet: string;
}

export interface ChatHistoryPart {
  text: string;
}

export interface ChatHistoryEntry {
  role: "user" | "assistant";
  content?: string;
  parts?: ChatHistoryPart[];
  createdAt?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  createdAt?: string;
  isStreaming?: boolean;
}
