import { NextResponse } from "next/server";
import { backendBaseUrl, getBackendUrl } from "@/config/api";
import { getStatus } from "@/server/documents/documentStore";

export async function GET(request: Request) {
  if (backendBaseUrl) {
    const url = new URL(request.url);
    const fileId = url.searchParams.get("fileId") || "";
    if (!fileId) {
      return NextResponse.json(
        { error: "Missing fileId query parameter." },
        { status: 400 }
      );
    }

    const backendUrl = getBackendUrl(`/api/index/status/${encodeURIComponent(fileId)}`);
    const backendResponse = await fetch(backendUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    return new NextResponse(backendResponse.body, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
      headers: backendResponse.headers,
    });
  }

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
