import { NextResponse } from "next/server";
import {
  backendBaseUrl,
  getBackendUrl,
  organizationId,
  uploadedBy,
} from "@/config/api";
import { createDocument } from "@/server/documents/documentStore";

export async function POST(request: Request) {
  if (backendBaseUrl) {
    try {
      if (!organizationId || !uploadedBy) {
        return NextResponse.json(
          { error: "Server organization or uploader configuration is missing." },
          { status: 500 }
        );
      }

      const formData = await request.formData();
      if (!(formData.get("pdf") instanceof File)) {
        return NextResponse.json({ error: "Missing file field 'pdf'." }, { status: 400 });
      }

      formData.set("organizationId", organizationId);
      formData.set("uploadedBy", uploadedBy);

      const backendResponse = await fetch(getBackendUrl("/api/upload-document"), {
        method: "POST",
        // Do not set Content-Type: fetch adds the required multipart boundary.
        body: formData,
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
              ? `Unable to reach document backend: ${error.message}`
              : "Unable to reach document backend.",
        },
        { status: 502 }
      );
    }
  }

  try {
    const formData = await request.formData();
    const file = formData.get("pdf");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file field 'pdf'." }, { status: 400 });
    }

    const document = createDocument(file);
    return NextResponse.json({
      status: document.status,
      fileId: document.fileId,
      fileName: document.fileName,
      message: "File upload accepted and indexing has started.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed." },
      { status: 500 }
    );
  }
}
