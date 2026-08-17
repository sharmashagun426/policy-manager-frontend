import { NextResponse } from "next/server";
import { backendBaseUrl, getBackendUrl } from "@/config/api";
import { createDocument } from "@/server/documents/documentStore";

export async function POST(request: Request) {
  if (backendBaseUrl) {
    try {
      const headers = new Headers(request.headers);
      headers.delete("host");

      const backendResponse = await fetch(getBackendUrl("/api/index"), {
        method: "POST",
        headers,
        body: request.body,
        // Node.js requires this when a Request body is streamed to fetch.
        // @ts-expect-error `duplex` is a Node fetch extension, not yet in DOM types.
        duplex: "half",
      });

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

  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Expected multipart/form-data content type." },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("pdf");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "Missing file field 'pdf' in multipart form data." },
        { status: 400 }
      );
    }

    if (!file.type || !file.type.includes("pdf")) {
      return NextResponse.json(
        { error: "Uploaded file must be a PDF." },
        { status: 400 }
      );
    }

    const document = createDocument(file);

    return NextResponse.json({
      status: document.status,
      fileId: document.fileId,
      fileName: document.fileName,
      message: "File upload accepted and indexing has started.",
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed." },
      { status: 500 }
    );
  }
}
