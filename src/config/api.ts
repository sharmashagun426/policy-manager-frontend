export const apiRoutes = {
  chat: "/api/chat",
  uploadDocument: "/api/upload-document",
  documents: "/api/documents",
  updateSearch: "/api/update/search",
  updateExecute: "/api/update/execute",
} as const;

export const backendBaseUrl =
  process.env.CHAT_BACKEND_BASE_URL || process.env.BACKEND_BASE_URL || "";

export const organizationId = process.env.POLICYBOT_ORGANIZATION_ID || "";
export const uploadedBy = process.env.POLICYBOT_UPLOADED_BY || "";

export function getBackendUrl(path: string) {
  return `${backendBaseUrl.replace(/\/$/, "")}${path}`;
}
