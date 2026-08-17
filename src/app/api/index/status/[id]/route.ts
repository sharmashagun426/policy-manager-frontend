import { NextResponse } from "next/server";
import { backendBaseUrl, getBackendUrl } from "@/config/api";
import { getStatus } from "@/server/documents/documentStore";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Missing file ID." }, { status: 400 });
  }

  if (backendBaseUrl) {
    try {
      const backendResponse = await fetch(
        getBackendUrl(`/api/index/status/${encodeURIComponent(id)}`),
        { method: "GET", cache: "no-store" }
      );

      return new NextResponse(backendResponse.body, {
        status: backendResponse.status,
        statusText: backendResponse.statusText,
        headers: backendResponse.headers,
      });
    } catch (error) {
      return NextResponse.json(
        {
          error:
            error instanceof Error
              ? `Unable to reach indexing backend: ${error.message}`
              : "Unable to reach indexing backend.",
        },
        { status: 502 }
      );
    }
  }

  const status = getStatus(id);
  if (!status) {
    return NextResponse.json({ error: "File not found." }, { status: 404 });
  }

  return NextResponse.json(status);
}
