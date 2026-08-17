import { NextResponse } from "next/server";
import { getAllDocuments, normalizeDocument } from "@/server/documents/documentStore";

export async function GET() {
  const documents = getAllDocuments().map(normalizeDocument);
  return NextResponse.json(documents);
}
