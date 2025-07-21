import api from "./api";
import type {
  TSaveReferralPayload,
  TSaveReferralResponse,
  TReferralListResponse,
  TReferralStatusUpdatePayload,
  TReferralStatusUpdateResponse,
} from "@/types/referral.d";

/**
 * Saves a new referral.
 * @param payload - The referral data.
 * @returns The API response.
 */
export const saveReferral = async (
  payload: TSaveReferralPayload
): Promise<TSaveReferralResponse> => {
  const { data } = await api.post<TSaveReferralResponse>(
    "/save-referral-data/",
    payload
  );
  return data;
};

/**
 * Fetches the list of referrals for HR.
 * @returns The list of referrals.
 */
export const getReferralList = async (): Promise<TReferralListResponse> => {
  const { data } = await api.get<TReferralListResponse>("/referral-list/");
  return data;
};

/**
 * Updates the status of a referral.
 * @param payload - The referral ID and new status.
 * @returns The API response.
 */
export const updateReferralStatus = async (
  payload: TReferralStatusUpdatePayload
): Promise<TReferralStatusUpdateResponse> => {
  const { data } = await api.post<TReferralStatusUpdateResponse>(
    "/referral-status-change/",
    payload
  );
  return data;
};

// --- Mocked functions to be replaced later ---

/**
 * Fetches the profile of the currently authenticated user.
 * @returns A promise that resolves to the user's profile data.
 */
export const getUserProfile = async () => {
  // const { data } = await api.get("/users/me");
  // return data;
  return Promise.resolve({ name: "Sarah Johnson", employeeId: "EMP001234" });
};

/**
 * Fetches the list of departments and their associated roles.
 * @returns A promise that resolves to the department data.
 */
export const getDepartments = async () => {
  // const { data } = await api.get("/departments");
  // return data;
  return Promise.resolve({
    Engineering: [
      "Senior Frontend Developer",
      "Backend Engineer",
      "Full Stack Developer",
      "DevOps Engineer",
    ],
    Marketing: ["Digital Marketing Manager", "Content Strategist"],
    Sales: ["Account Executive", "Customer Success Manager"],
  });
};
