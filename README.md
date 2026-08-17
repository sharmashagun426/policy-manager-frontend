# PolicyBot — AI document Q&A SaaS (frontend)

A Next.js 15 (App Router) + MUI frontend for an internal-document AI chatbot:
ask questions in plain language, get answers grounded in your organization's
PDFs, with citations down to the document and page. Includes an admin
console for uploading, tracking, and managing the document library.

## Stack

- **Next.js** (App Router, TypeScript)
- **MUI v7** for components, a custom theme in `src/lib/theme.ts`
- **JetBrains Mono + Inter** (self-hosted via `@fontsource`, no external font fetch needed)
- All state is currently mocked client-side — see "Connecting a real backend" below.

## Getting started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` for the public chatbot, and
`http://localhost:3000/admin/login` for the admin console (any email +
password of 4+ characters signs you in — this is a mock auth layer, see below).

## Project structure

```
src/
  app/
    page.tsx                 Public chatbot page
    admin/
      layout.tsx              Auth-gated shell (sidebar + guard)
      login/page.tsx           Admin login
      dashboard/page.tsx       Stats + upload + recent documents
      documents/page.tsx       Full document library, search + filter
  components/
    chat/                     Chat UI: bubbles, citations, source drawer, input
    admin/                    Sidebar, documents table, upload dropzone, status chip
    Logo.tsx
  lib/
    theme.ts                  Design tokens + MUI theme
    types.ts                  Shared TS types (OrgDocument, ChatMessage, Citation)
    mockData.ts                Seed documents + canned Q&A used by the mock API
    api.ts                     Mock API layer -- the seam to replace with real endpoints
    AuthContext.tsx            Mock session auth (sessionStorage-based)
    useDocuments.ts            Document list state + polling for status changes
```

## Connecting a real backend

Everything the UI needs goes through **`src/lib/api.ts`**. Each exported
function currently reads/writes an in-memory array and simulates latency;
swap the body of each for a real `fetch` call and nothing else in the app
needs to change:

- `fetchDocuments()` -> `GET /api/documents`
- `uploadDocument(file)` -> `POST /api/documents` (multipart) -- return the
  created document with `status: "processing"`; your backend should update
  status asynchronously as OCR/indexing completes (poll or push over
  WebSocket/SSE -- `useDocuments.ts` already polls while any document is
  `processing`, so a simple polling backend works with zero UI changes)
- `deleteDocument(id)` -> `DELETE /api/documents/:id`
- `retryDocument(id)` -> `POST /api/documents/:id/retry`
- `askQuestion(question)` -> `POST /api/chat` -- return `{ content, citations }`
  where each citation has `documentId`, `documentTitle`, `page`, `snippet`

For real auth, replace `src/lib/AuthContext.tsx` with calls to your auth
provider (NextAuth, Clerk, Auth0, or your own JWT/session endpoint) -- the
rest of the app only depends on `isAuthenticated`, `userEmail`, `orgName`,
`login()`, and `logout()` from `useAuth()`.

## Design notes

- Palette: ink-navy (`#11162A`) + a single deep verdigris accent (`#1C6B5A`)
  meant to read as "verified / sourced," with amber reserved strictly for
  in-progress states and red for failures.
- Citations render as small mono-font numeral chips, styled like a footnote
  marker -- clicking one opens a right-hand drawer with the exact passage,
  document, and page it came from. This is the one recurring signature
  element tying the public chat and admin document table together.
- The document status chip (`Processing` / `Ready` / `Failed`) uses the same
  color language in both the chat citations and the admin table.

## Known gaps to fill for production

- Real backend + persistence (see above)
- Real auth/session handling + role-based access if you need multiple admins
- PDF viewer / page-jump when clicking a citation (currently shows the
  snippet text only -- wiring a viewer is the natural next step)
- Org/team management, billing (this UI covers a single organization)
- File size / type validation messaging beyond the current client-side filter
