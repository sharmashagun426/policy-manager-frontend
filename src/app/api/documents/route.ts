import { NextResponse } from "next/server";
import { backendBaseUrl, getBackendUrl, organizationId } from "@/config/api";
import { getAllDocuments, normalizeDocument } from "@/server/documents/documentStore";

export async function GET() {
  if (backendBaseUrl) {
    try {
      if (!organizationId) {
        return NextResponse.json(
          { error: "Server organization configuration is missing." },
          { status: 500 }
        );
      }

      const backendResponse = await fetch(getBackendUrl(`/api/documents?organizationId=${encodeURIComponent(organizationId)}`), {
        cache: "no-store",
      });
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

  const documents = getAllDocuments().map(normalizeDocument);
  return NextResponse.json(documents);
}
