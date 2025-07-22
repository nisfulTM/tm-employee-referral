import type { ReferralStatus } from "./hr.d";

// Re-export all types from the declaration file
export type * from "./hr.d";

/* ✅ Status Labels & Colors */
export const statusLabels: Record<ReferralStatus, string> = {
  received: "Received",
  shortlisted: "Shortlisted",
  on_hold: "On-hold",
  rejected: "Rejected",
  hired: "Hired",
};

export const statusColors: Record<ReferralStatus, string> = {
  received: "bg-yellow-500 text-black",
  shortlisted: "bg-blue-500 text-white",
  on_hold: "bg-purple-500 text-white",
  rejected: "bg-red-500 text-white",
  hired: "bg-green-700 text-white",
};

/* ✅ Mock Referrals */
export const mockReferrals: Referral[] = [
  {
    id: "R1",
    candidateName: "John Doe",
    candidateEmail: "john@example.com",
    yearsOfExperience: 5,
    relation: "Friend",
    position: { title: "Frontend Developer", department: "IT" },
    referrerName: "Jane Smith",
    referrerEmployeeId: "EMP001",
    status: "received",
    submittedAt: new Date().toISOString(),
    resumeUrl: "/resumes/john_doe.pdf",
  },
  {
    id: "R2",
    candidateName: "Alice Johnson",
    candidateEmail: "alice@example.com",
    yearsOfExperience: 3,
    relation: "Colleague",
    position: { title: "Backend Developer", department: "Engineering" },
    referrerName: "Mark Lee",
    referrerEmployeeId: "EMP002",
    status: "shortlisted",
    submittedAt: new Date().toISOString(),
    resumeUrl: "/resumes/alice_johnson.pdf",
  },
];
