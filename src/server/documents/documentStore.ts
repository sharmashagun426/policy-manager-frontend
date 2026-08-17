import { OrgDocument } from "@/features/documents/types";

export type IndexedStatus = "Processing" | "Ready" | "Failed";

export interface StatusPayload {
  status: IndexedStatus;
  fileName: string;
  storagePath: string | null;
  chunks: number;
  error: string | null;
}

interface StoredDocument {
  fileId: string;
  fileName: string;
  title: string;
  category: string;
  pages: number;
  sizeKb: number;
  status: IndexedStatus;
  uploadedBy: string;
  uploadedAt: string;
  failReason?: string;
  storagePath: string | null;
  chunks: number;
  error: string | null;
}

const documents: StoredDocument[] = [];
const randomFileId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

function scheduleStatusUpdate(fileId: string) {
  const willFail = Math.random() < 0.15;
  setTimeout(() => {
    const index = documents.findIndex((doc) => doc.fileId === fileId);
    if (index === -1) return;
    const doc = documents[index];
    documents[index] = {
      ...doc,
      status: willFail ? "Failed" : "Ready",
      storagePath: willFail ? null : `/storage/${doc.fileId}/${encodeURIComponent(doc.fileName)}`,
      chunks: willFail ? 0 : Math.max(1, Math.round(doc.pages * 1.25)),
      error: willFail ? "Scanned pages below OCR confidence threshold" : null,
      failReason: willFail ? "Scanned pages below OCR confidence threshold" : undefined,
    };
  }, 4000 + Math.random() * 3000);
}

export function createDocument(file: File): StoredDocument {
  const document: StoredDocument = {
    fileId: randomFileId(), fileName: file.name,
    title: file.name.replace(/\.pdf$/i, "").replace(/[-_]/g, " "),
    category: "Uncategorized", pages: Math.max(1, Math.round(file.size / 42000)),
    sizeKb: Math.round(file.size / 1024), status: "Processing", uploadedBy: "You",
    uploadedAt: new Date().toISOString(), storagePath: null, chunks: 0, error: null,
  };
  documents.unshift(document);
  scheduleStatusUpdate(document.fileId);
  return document;
}

export function getAllDocuments() { return [...documents]; }
export function getDocumentById(fileId: string) { return documents.find((doc) => doc.fileId === fileId); }

export function getStatus(fileId: string): StatusPayload | null {
  const doc = getDocumentById(fileId);
  if (!doc) return null;

  return {
    status: doc.status,
    fileName: doc.fileName,
    storagePath: doc.storagePath,
    chunks: doc.chunks,
    error: doc.error,
  };
}

export function deleteDocument(fileId: string) {
  const index = documents.findIndex((doc) => doc.fileId === fileId);
  if (index === -1) return false;
  documents.splice(index, 1);
  return true;
}

export function retryDocument(fileId: string) {
  const doc = getDocumentById(fileId);
  if (!doc) return null;
  doc.status = "Processing"; doc.storagePath = null; doc.chunks = 0; doc.error = null; doc.failReason = undefined;
  scheduleStatusUpdate(fileId);
  return doc;
}

export function normalizeDocument(doc: StoredDocument): OrgDocument {
  return { id: doc.fileId, fileName: doc.fileName, title: doc.title, category: doc.category,
    pages: doc.pages, sizeKb: doc.sizeKb, status: doc.status.toLowerCase() as OrgDocument["status"],
    uploadedBy: doc.uploadedBy, uploadedAt: doc.uploadedAt, failReason: doc.failReason };
}
