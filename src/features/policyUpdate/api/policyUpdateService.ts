import { apiRoutes } from "@/config/api";
import type { PolicyExecuteResponse, PolicySearchResult } from "../types";

async function parseResponse<T>(response: Response): Promise<T> {
  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data && typeof data === "object" && "error" in data
        ? String(data.error)
        : `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data as T;
}

export async function searchPolicyUpdate(instruction: string) {
  return parseResponse<PolicySearchResult[]>(
    await fetch(apiRoutes.updateSearch, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ instruction }),
    })
  );
}

export async function executePolicyUpdate(
  result: PolicySearchResult,
  instruction: string
) {
  const { text: originalText, ...metadata } = result.metadata;

  return parseResponse<PolicyExecuteResponse>(
    await fetch(apiRoutes.updateExecute, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: result.id,
        originalText,
        instruction,
        metadata,
      }),
    })
  );
}
