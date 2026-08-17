import { NextResponse } from "next/server";
import { getStatus } from "@/server/documents/documentStore";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const fileId = url.searchParams.get("fileId");

  if (!fileId) {
    return NextResponse.json(
      { error: "Missing fileId query parameter." },
      { status: 400 }
    );
  }

  const status = getStatus(fileId);
  if (!status) {
    return NextResponse.json({ error: "File not found." }, { status: 404 });
  }

  return NextResponse.json(status);
}
