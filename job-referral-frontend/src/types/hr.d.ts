/* ✅ Types */
export type ReferralStatus =
  | "received"
  | "shortlisted"
  | "on_hold"
  | "rejected"
  | "hired";

export interface Position {
  title: string;
  department: string;
}

export interface Referral {
  id: string;
  candidateName: string;
  candidateEmail: string;
  yearsOfExperience: number;
  relation: string;
  position: Position;
  referrerName: string;
  referrerEmployeeId: string;
  status: ReferralStatus;
  submittedAt: string;
  updatedAt?: Date;
  notes?: string;
  resumeUrl: string;
}
