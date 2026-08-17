import { apiRoutes } from "@/config/api";
import { DocumentStatus, IndexResponse, OrgDocument } from "../types";

async function parseResponse<T>(response: Response): Promise<T> {
  let data: unknown;

  try {
    data = await response.json();
  } catch {
    data = await response.text().catch(() => "");
  }

  if (!response.ok) {
    const message =
      typeof data === "object" && data !== null && "error" in data
        ? String(data.error)
        : data;
    throw new Error(message || `Request failed with ${response.status}`);
  }

  return data as T;
}

export async function uploadDocument(file: File): Promise<IndexResponse> {
  const formData = new FormData();
  formData.append("pdf", file);

  return parseResponse<IndexResponse>(
    await fetch(apiRoutes.uploadDocument, { method: "POST", body: formData })
  );
}

function normalizeDocument(document: Record<string, unknown>): OrgDocument {
  const fileName = String(document.fileName ?? document.name ?? "Untitled document");
  const rawStatus = String(document.status ?? "Processing").toLowerCase();
  const status: DocumentStatus =
    rawStatus === "ready" || rawStatus === "failed" ? rawStatus : "processing";

  return {
    id: String(document.fileId ?? document.id ?? document._id ?? fileName),
    fileName,
    title: String(document.title ?? fileName.replace(/\.pdf$/i, "").replace(/[-_]/g, " ")),
    category: String(document.category ?? "Uncategorized"),
    pages: Number(document.pages ?? document.chunks ?? 0),
    sizeKb: Number(document.sizeKb ?? document.size ?? 0),
    status,
    uploadedBy: String(document.uploadedBy ?? "You"),
    uploadedAt: String(document.uploadedAt ?? document.createdAt ?? new Date().toISOString()),
    failReason: typeof document.error === "string" ? document.error : undefined,
  };
}

export async function fetchDocuments(): Promise<OrgDocument[]> {
  const response = await parseResponse<unknown>(
    await fetch(apiRoutes.documents, { cache: "no-store" })
  );
  const documents = Array.isArray(response)
    ? response
    : response && typeof response === "object" && Array.isArray((response as { documents?: unknown }).documents)
      ? (response as { documents: unknown[] }).documents
      : [];

  return documents
    .filter((document): document is Record<string, unknown> => !!document && typeof document === "object")
    .map(normalizeDocument);
}

export async function fetchDocumentById(id: string): Promise<OrgDocument> {
  const response = await parseResponse<Record<string, unknown>>(
    await fetch(`${apiRoutes.documents}/${encodeURIComponent(id)}`, {
      cache: "no-store",
    })
  );
  return normalizeDocument(response);
}

export async function deleteDocument(id: string): Promise<void> {
  await parseResponse<{ success: boolean }>(
    await fetch(`${apiRoutes.documents}/${encodeURIComponent(id)}`, {
      method: "DELETE",
    })
  );
}

export async function retryDocument(id: string): Promise<void> {
  await parseResponse<{ success: boolean }>(
    await fetch(`${apiRoutes.documents}/${encodeURIComponent(id)}`, {
      method: "POST",
    })
  );
}
