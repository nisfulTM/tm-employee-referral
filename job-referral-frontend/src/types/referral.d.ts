import { z } from "zod";

export const ReferralSchema = z.object({
  refereeName: z.string().min(1, "Full Name is required"),
  refereeEmail: z.string().email("Invalid email address"),
  refereePhone: z.string().optional(),
  refereeLinkedIn: z.string().url().optional().or(z.literal('')),
  department: z.string().min(1, "Department is required"),
  role: z.string().min(1, "Role is required"),
  comments: z.string().optional(),
  resume: z.any().optional(), // For file uploads
});

export type TReferralForm = z.infer<typeof ReferralSchema>;

export type TSaveReferralPayload = {
  fullname: string;
  email: string;
  phone_number: string;
  linkedin_url?: string;
  department: string;
  role: string;
  resume: string; // base64 encoded
};

export type TSaveReferralResponse = {
  message: string;
  status: boolean;
};

export type TReferralItem = {
  id: number;
  resume: string;
  fullname: string;
  email: string;
  phone_number: string;
  linkedin_url: string | null;
  department: string;
  role: string;
  status: string;
  created_at: string;
  referred_by: number;
};

export type TReferralListResponse = {
  data: {
    new: TReferralItem[];
    active: TReferralItem[];
    history: TReferralItem[];
  };
  message: string;
  status: boolean;
};

export type TReferralStatusUpdatePayload = {
  id: number;
  status: string;
  notes: string;
};

export type TReferralStatusUpdateResponse = {
  message: string;
  status: boolean;
};
