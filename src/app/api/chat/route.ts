import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/config/api";

function normalizeHistoryEntry(item: unknown): any | null {
  if (!item || typeof item !== "object" || Array.isArray(item)) {
    return null;
  }

  let role = (item as any).role;
  if (role === "assistant") role = "model"; 
  if (role !== "user" && role !== "model") return null;

  // Extract text from parts
  const parts = Array.isArray((item as any).parts)
    ? (item as any).parts
        .map((part: any) =>
          part && typeof part.text === "string" ? part.text.trim() : ""
        )
        .filter(Boolean)
    : [];

  if (parts.length === 0) return null;

  return {
    role,
    parts: parts.map((text: string) => ({ text })),
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, history } = body;

    // Clean history: Gemini ONLY accepts 'role' and 'parts'
    // Gemini roles MUST be 'user' or 'model'
    const forwardHistory = Array.isArray(history) 
      ? history.map((entry: any) => ({
          role: entry.role === "assistant" ? "model" : "user",
          parts: [{ text: entry.parts[0].text }] // Ensure strict parts structure
        }))
      : [];

    const chatBackendUrl = getBackendUrl("/api/chat");
    if (!chatBackendUrl) {
      throw new Error("CHAT_API_URL is not defined");
    }

    const response = await fetch(chatBackendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        question, 
        history: forwardHistory 
      }),
    });

    if (!response.ok) {
        throw new Error(`Backend responded with ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      content: data.answer, // Map 'answer' from Node to 'content' for Redux
      citations: data.citations || []
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
