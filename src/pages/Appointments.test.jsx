import { describe, expect, it, vi } from "vitest";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { api, toLocalISODate } from "../lib/api";
import { Appointments } from "./Appointments";
import { httpError, renderApp } from "../test/utils";

const inHours = (h) => {
  const d = new Date(Date.now() + h * 3600 * 1000);
  return { date: toLocalISODate(d), time: `${String(d.getHours()).padStart(2, "0")}:00` };
};

const base = { doctor: "Dr. John Doe", doctor_id: 3, price: 150, payment_status: "pay_in_person", review: null };

const appointments = [
  { id: 1, service: "Teeth Whitening", status: "upcoming", ...base, ...inHours(72) },
  { id: 2, service: "Emergency Dentistry", status: "upcoming", ...base, ...inHours(5) },
  { id: 3, service: "General Checkups", status: "completed", ...base, payment_status: "paid", date: "2026-01-05", time: "10:00" },
];

const card = (service) => screen.getByText(service).closest("article");

describe("patient appointments", () => {
  const setup = () => {
    vi.spyOn(api, "get").mockImplementation((url) =>
      url === "/user-appointments" ? Promise.resolve({ data: appointments }) : Promise.reject(httpError(404))
    );
    vi.spyOn(api, "patch").mockResolvedValue({ data: {} });
    return renderApp(<Appointments />, { route: "/user/dashboard/appointments" });
  };

  it("only allows changes more than 24h ahead", async () => {
    setup();
    await screen.findByText("Teeth Whitening");

    expect(within(card("Teeth Whitening")).getByRole("button", { name: /reschedule/i })).toBeInTheDocument();
    expect(within(card("Teeth Whitening")).getByRole("button", { name: /^cancel$/i })).toBeInTheDocument();

    const soon = card("Emergency Dentistry");
    expect(within(soon).queryByRole("button", { name: /reschedule/i })).not.toBeInTheDocument();
    expect(within(soon).getByText(/up to 24h before/i)).toBeInTheDocument();
  });

  it("offers a review and invoice for completed visits", async () => {
    setup();
    await screen.findByText("General Checkups");
    const done = card("General Checkups");
    expect(within(done).getByRole("button", { name: /leave a review/i })).toBeInTheDocument();
    expect(within(done).getByRole("button", { name: /invoice/i })).toBeInTheDocument();
  });

  it("cancels an appointment with a reason", async () => {
    const user = userEvent.setup();
    setup();
    await screen.findByText("Teeth Whitening");

    await user.click(within(card("Teeth Whitening")).getByRole("button", { name: /^cancel$/i }));
    const dialog = await screen.findByRole("dialog");
    await user.type(within(dialog).getByLabelText(/reason/i), "Travelling");
    await user.click(within(dialog).getByRole("button", { name: /cancel appointment/i }));

    await waitFor(() => expect(api.patch).toHaveBeenCalledWith("/appointments/1/cancel", { reason: "Travelling" }));
  });
});
