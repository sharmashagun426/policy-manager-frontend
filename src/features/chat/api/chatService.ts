import { apiRoutes } from "@/config/api";
import { ChatHistoryEntry, Citation } from "../types";

export async function askQuestion(
  question: string,
  history: ChatHistoryEntry[] = []
): Promise<{ content: string; citations: Citation[] }> {
  const response = await fetch(apiRoutes.chat, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, history }),
  });

  if (!response.ok) throw new Error("Failed to fetch chat answer");

  const data = await response.json();
  return { content: data.content, citations: data.citations || [] };
}
