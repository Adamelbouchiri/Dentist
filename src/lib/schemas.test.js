import { describe, expect, it, vi } from "vitest";
import { applyServerErrors, contactSchema, loginSchema, registerSchema } from "./schemas";

const firstIssue = (result) => result.error?.issues[0];

describe("form schemas", () => {
  it("requires a valid email to sign in", () => {
    const r = loginSchema.safeParse({ email: "nope", password: "x" });
    expect(r.success).toBe(false);
    expect(firstIssue(r).message).toBe("validation.email");
  });

  it("rejects mismatched registration passwords on the confirmation field", () => {
    const r = registerSchema.safeParse({
      name: "Sara",
      email: "sara@example.com",
      password: "supersecret",
      password_confirmation: "different1",
    });
    expect(r.success).toBe(false);
    expect(firstIssue(r).path).toEqual(["password_confirmation"]);
    expect(firstIssue(r).message).toBe("validation.passwordMatch");
  });

  it("enforces the 8 character password minimum", () => {
    const r = registerSchema.safeParse({ name: "Sara", email: "sara@example.com", password: "short", password_confirmation: "short" });
    expect(r.success).toBe(false);
    expect(firstIssue(r).message).toBe("validation.passwordMin");
  });

  it("accepts a contact message with an optional empty phone", () => {
    const ok = contactSchema.safeParse({ name: "Sara", email: "sara@example.com", phone: "", message: "I'd like a whitening quote please." });
    expect(ok.success).toBe(true);

    const badPhone = contactSchema.safeParse({ name: "Sara", email: "sara@example.com", phone: "call me", message: "Hello there, a question." });
    expect(firstIssue(badPhone).message).toBe("validation.phone");
  });

  it("maps Laravel 422 errors onto form fields", () => {
    const setError = vi.fn();
    const applied = applyServerErrors({ response: { data: { errors: { email: ["Taken."], name: "Too short." } } } }, setError);
    expect(applied).toBe(true);
    expect(setError).toHaveBeenCalledWith("email", { type: "server", message: "Taken." });
    expect(setError).toHaveBeenCalledWith("name", { type: "server", message: "Too short." });
    expect(applyServerErrors(new Error("network"), setError)).toBe(false);
  });
});
