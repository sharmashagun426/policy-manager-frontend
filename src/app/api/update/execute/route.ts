import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/config/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const required = ["id", "originalText", "instruction", "metadata"];
    if (required.some((key) => !body[key])) {
      return NextResponse.json({ error: "The selected update is incomplete." }, { status: 400 });
    }

    const response = await fetch(getBackendUrl("/api/update/execute"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const error = data?.error || data?.message || "Could not update the policy.";
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
