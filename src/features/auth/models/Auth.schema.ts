import { z } from "zod";


const PASSWORD_REGEX =
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .regex(
    PASSWORD_REGEX,
    "Password must include uppercase, lowercase, number"
  );

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Invalid email format."),
  password: passwordSchema,
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type LoginFormValues_input=z.input<typeof loginSchema>
export type LoginFormValues_output=z.output<typeof loginSchema>

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Full name must be at least 2 characters."),
    email: z
      .string()
      .min(1, "Email is required.")
      .email("Invalid email format."),
    password: passwordSchema,
    confirmPassword: z
      .string()
      .min(1, "Confirm password is required."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export type RegisterFormValues_input=z.input<typeof registerSchema>