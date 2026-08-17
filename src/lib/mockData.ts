import { ChatMessage, Citation, OrgDocument } from "./types";

export const mockDocuments: OrgDocument[] = [
  {
    id: "doc_001",
    fileName: "employee-handbook-2026.pdf",
    title: "Employee Handbook 2026",
    category: "HR Policy",
    pages: 84,
    sizeKb: 3120,
    status: "ready",
    uploadedBy: "R. Sharma",
    uploadedAt: "2026-07-28T09:12:00Z",
  },
  {
    id: "doc_002",
    fileName: "expense-reimbursement-process.pdf",
    title: "Expense Reimbursement Process",
    category: "Finance",
    pages: 12,
    sizeKb: 640,
    status: "ready",
    uploadedBy: "A. Verma",
    uploadedAt: "2026-07-30T14:05:00Z",
  },
  {
    id: "doc_003",
    fileName: "information-security-policy-v4.pdf",
    title: "Information Security Policy v4",
    category: "IT & Security",
    pages: 46,
    sizeKb: 2210,
    status: "ready",
    uploadedBy: "S. Iyer",
    uploadedAt: "2026-08-01T11:40:00Z",
  },
  {
    id: "doc_004",
    fileName: "leave-and-attendance-policy.pdf",
    title: "Leave & Attendance Policy",
    category: "HR Policy",
    pages: 18,
    sizeKb: 980,
    status: "processing",
    uploadedBy: "R. Sharma",
    uploadedAt: "2026-08-06T08:20:00Z",
  },
  {
    id: "doc_005",
    fileName: "vendor-onboarding-checklist.pdf",
    title: "Vendor Onboarding Checklist",
    category: "Procurement",
    pages: 9,
    sizeKb: 410,
    status: "failed",
    uploadedBy: "N. Kulkarni",
    uploadedAt: "2026-08-05T16:55:00Z",
    failReason: "Scanned pages below OCR confidence threshold",
  },
  {
    id: "doc_006",
    fileName: "code-of-conduct.pdf",
    title: "Code of Conduct",
    category: "HR Policy",
    pages: 22,
    sizeKb: 1120,
    status: "ready",
    uploadedBy: "A. Verma",
    uploadedAt: "2026-07-15T10:00:00Z",
  },
  {
    id: "doc_007",
    fileName: "incident-response-runbook.pdf",
    title: "Incident Response Runbook",
    category: "IT & Security",
    pages: 31,
    sizeKb: 1580,
    status: "processing",
    uploadedBy: "S. Iyer",
    uploadedAt: "2026-08-06T18:02:00Z",
  },
];

export const suggestedQuestions: string[] = [
  "How many paid leave days do I get per year?",
  "What is the process to claim travel expenses?",
  "What counts as a reportable security incident?",
  "How do I onboard a new vendor?",
];

const sampleCitations: Record<string, Citation[]> = {
  leave: [
    {
      id: "c1",
      documentId: "doc_001",
      documentTitle: "Employee Handbook 2026",
      page: 34,
      snippet:
        "Full-time employees accrue 1.75 days of paid leave per completed month of service, up to a maximum of 21 days per calendar year.",
    },
    {
      id: "c2",
      documentId: "doc_004",
      documentTitle: "Leave & Attendance Policy",
      page: 6,
      snippet:
        "Unused leave beyond 5 days is forfeited at year end unless carried forward with manager approval before December 15.",
    },
  ],
  expense: [
    {
      id: "c3",
      documentId: "doc_002",
      documentTitle: "Expense Reimbursement Process",
      page: 3,
      snippet:
        "All claims above ₹2,000 require an original receipt uploaded to the finance portal within 15 days of the expense.",
    },
    {
      id: "c4",
      documentId: "doc_002",
      documentTitle: "Expense Reimbursement Process",
      page: 7,
      snippet:
        "Travel reimbursements are processed within 2 payroll cycles after manager approval.",
    },
  ],
  security: [
    {
      id: "c5",
      documentId: "doc_003",
      documentTitle: "Information Security Policy v4",
      page: 21,
      snippet:
        "A reportable incident includes any unauthorized access, data exfiltration attempt, or loss of a company device containing customer data.",
    },
    {
      id: "c6",
      documentId: "doc_007",
      documentTitle: "Incident Response Runbook",
      page: 4,
      snippet:
        "Employees must notify the Security Desk within 30 minutes of discovering a suspected incident, via the #sec-incident channel or the hotline.",
    },
  ],
  vendor: [
    {
      id: "c7",
      documentId: "doc_005",
      documentTitle: "Vendor Onboarding Checklist",
      page: 2,
      snippet:
        "New vendors must complete a KYC form and pass procurement compliance review before a purchase order can be issued.",
    },
  ],
};

export function mockAnswerFor(question: string): {
  content: string;
  citations: Citation[];
} {
  const q = question.toLowerCase();
  if (q.includes("leave") || q.includes("paid") || q.includes("vacation")) {
    return {
      content:
        "Full-time employees accrue 1.75 days of paid leave per completed month, capping at 21 days a year. Up to 5 unused days can roll over into the next year if your manager approves the carry-forward before December 15 — anything beyond that is forfeited.",
      citations: sampleCitations.leave,
    };
  }
  if (q.includes("expense") || q.includes("travel") || q.includes("reimburse")) {
    return {
      content:
        "Claims over ₹2,000 need an original receipt uploaded to the finance portal within 15 days of the expense. Once your manager approves it, travel reimbursements land within two payroll cycles.",
      citations: sampleCitations.expense,
    };
  }
  if (q.includes("security") || q.includes("incident") || q.includes("breach")) {
    return {
      content:
        "A reportable incident covers unauthorized access, data exfiltration attempts, or a lost device holding customer data. If you spot one, notify the Security Desk within 30 minutes through #sec-incident or the hotline.",
      citations: sampleCitations.security,
    };
  }
  if (q.includes("vendor") || q.includes("onboard")) {
    return {
      content:
        "New vendors need a completed KYC form and a passed procurement compliance review before any purchase order can be raised.",
      citations: sampleCitations.vendor,
    };
  }
  return {
    content:
      "I looked through the indexed policy library but couldn't find a confident match for that in the current documents. Try rephrasing, or ask about leave, expenses, security incidents, or vendor onboarding — those are well covered right now.",
    citations: [],
  };
}

export const seedMessages: ChatMessage[] = [
  {
    id: "m0",
    role: "assistant",
    content:
      "Hi, I'm PolicyBot. Ask me anything about company policy or process — I'll answer from your organization's documents and show you exactly where it came from.",
    createdAt: new Date().toISOString(),
  },
];
