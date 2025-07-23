import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export type TLogin = z.infer<typeof LoginSchema>;

export type TUser = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  employee_id: string;
  type: "employee" | "hr";
  is_active: boolean;
  date_joined: string;
};

export type TTokens = {
  refresh: string;
  access: string;
};

export type TLoginResponse = {
  user: TUser;
  tokens: TTokens;
  dashboard_url: string;
  message: string;
};
