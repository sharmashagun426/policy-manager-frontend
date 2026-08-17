import { NextResponse } from "next/server";
import { backendBaseUrl, getBackendUrl, organizationId } from "@/config/api";
import { deleteDocument, retryDocument } from "@/server/documents/documentStore";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (backendBaseUrl) {
    try {
      if (!organizationId) {
        return NextResponse.json(
          { error: "Server organization configuration is missing." },
          { status: 500 }
        );
      }
      const backendResponse = await fetch(
        getBackendUrl(`/api/documents/${encodeURIComponent(id)}?organizationId=${encodeURIComponent(organizationId)}`),
        { cache: "no-store" }
      );
      return new NextResponse(backendResponse.body, {
        status: backendResponse.status,
        statusText: backendResponse.statusText,
        headers: backendResponse.headers,
      });
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Unable to reach document backend." },
        { status: 502 }
      );
    }
  }

  return NextResponse.json({ error: "Document details are unavailable in mock mode." }, { status: 404 });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deleted = deleteDocument(id);
  if (!deleted) {
    return NextResponse.json({ error: "Document not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const retried = retryDocument(id);
  if (!retried) {
    return NextResponse.json({ error: "Document not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
