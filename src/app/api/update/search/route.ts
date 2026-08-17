import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/config/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (typeof body.instruction !== "string" || !body.instruction.trim()) {
      return NextResponse.json({ error: "Instruction is required." }, { status: 400 });
    }

    const response = await fetch(getBackendUrl("/api/update/search"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ instruction: body.instruction.trim() }),
    });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const error = data?.error || data?.message || "Could not search policy documents.";
      return NextResponse.json({ error }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected server error." },
      { status: 500 }
    );
  }
}
