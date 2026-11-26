import { z } from "zod";

// Messages are i18n keys — translate them where they're rendered: t(error.message)
const email = z.string().trim().min(1, "validation.required").email("validation.email");
const newPassword = z.string().min(8, "validation.passwordMin");

const withConfirmation = (schema, field = "password", confirm = "password_confirmation") =>
  schema.refine((v) => v[field] === v[confirm], { message: "validation.passwordMatch", path: [confirm] });

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "validation.required"),
});

export const registerSchema = withConfirmation(
  z.object({
    name: z.string().trim().min(2, "validation.nameMin"),
    email,
    password: newPassword,
    password_confirmation: z.string(),
  })
);

export const forgotSchema = z.object({ email });

export const resetSchema = withConfirmation(
  z.object({ password: newPassword, password_confirmation: z.string() })
);

export const contactSchema = z.object({
  name: z.string().trim().min(2, "validation.nameMin"),
  email,
  phone: z
    .string()
    .trim()
    .regex(/^[+\d\s().-]{0,20}$/, "validation.phone")
    .optional()
    .or(z.literal("")),
  message: z.string().trim().min(10, "validation.messageMin").max(2000, "validation.messageMax"),
});

export const nameSchema = z.object({ userName: z.string().trim().min(2, "validation.nameMin") });

export const changePasswordSchema = withConfirmation(
  z.object({
    currentPassword: z.string().min(1, "validation.required"),
    password: newPassword,
    password_confirmation: z.string(),
  })
);

/** Copy Laravel 422 `errors` onto react-hook-form fields. Returns true if any were applied. */
export const applyServerErrors = (error, setError, fieldMap = {}) => {
  const errors = error?.response?.data?.errors;
  if (!errors) return false;
  Object.entries(errors).forEach(([field, messages]) => {
    setError(fieldMap[field] ?? field, { type: "server", message: Array.isArray(messages) ? messages[0] : messages });
  });
  return true;
};
