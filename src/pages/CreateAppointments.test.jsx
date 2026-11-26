import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route } from "react-router-dom";
import { api } from "../lib/api";
import { CreateAppointments } from "./CreateAppointments";
import { httpError, renderApp } from "../test/utils";

const SLOTS = ["09:30", "10:00", "10:30", "11:00"];

describe("booking flow", () => {
  beforeEach(() => {
    // Monday 23 Nov 2026, 08:00 — the rest of the week is bookable
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2026, 10, 23, 8, 0));

    vi.spyOn(api, "get").mockImplementation((url) => {
      if (url === "/availability") return Promise.resolve({ data: { slots: SLOTS, booked: ["10:00"], closed: false } });
      // /services and /doctors not implemented yet → static fallback
      return Promise.reject(httpError(404));
    });
    vi.spyOn(api, "post").mockResolvedValue({ data: { id: 99 } });
  });

  afterEach(() => vi.useRealTimers());

  const renderBooking = () =>
    renderApp(<CreateAppointments />, {
      route: "/create-appointments",
      path: "/create-appointments",
      routes: <Route path="/user/dashboard/appointments" element={<p>my appointments</p>} />,
    });

  it("asks for a specialist before showing times", async () => {
    renderBooking();
    expect(await screen.findByText(/choose a specialist to see their available times/i)).toBeInTheDocument();
    expect(screen.getByText(/select a specialist, date and time/i)).toBeInTheDocument();
  });

  it("disables booked slots and books an in-person appointment", async () => {
    const user = userEvent.setup();
    renderBooking();

    await user.click(await screen.findByRole("button", { name: /Dr\. Cris Waxon/ }));

    const dateStep = screen.getByText("Choose date & time").closest("section");
    await user.click(within(dateStep).getByRole("button", { name: /24/ }));

    // 10:00 is already booked for this doctor
    await waitFor(() => expect(within(dateStep).getByRole("button", { name: "10:00" })).toBeDisabled());
    await user.click(within(dateStep).getByRole("button", { name: "10:30" }));

    await user.click(screen.getByRole("button", { name: /pay in person/i }));
    await user.click(screen.getByRole("button", { name: /confirm appointment/i }));

    await waitFor(() =>
      expect(api.post).toHaveBeenCalledWith(
        "/appointments",
        expect.objectContaining({
          service: "General Checkups",
          price: 150,
          doctor: "Dr. Cris Waxon",
          date: "2026-11-24",
          time: "10:30",
          payment_status: "pay_in_person",
        })
      )
    );
    expect(await screen.findByText("my appointments")).toBeInTheDocument();
  });

  it("asks the patient to pick again when the slot was just taken", async () => {
    api.post.mockRejectedValueOnce(httpError(422, { message: "Taken", errors: { time: ["This time slot has just been booked."] } }));
    const user = userEvent.setup();
    renderBooking();

    await user.click(await screen.findByRole("button", { name: /Dr\. Cris Waxon/ }));
    const dateStep = screen.getByText("Choose date & time").closest("section");
    await user.click(within(dateStep).getByRole("button", { name: /24/ }));
    await user.click(await within(dateStep).findByRole("button", { name: "10:30" }));
    await user.click(screen.getByRole("button", { name: /pay in person/i }));
    await user.click(screen.getByRole("button", { name: /confirm appointment/i }));

    // time selection is cleared → payment panel goes back to the prompt
    expect(await screen.findByText(/select a specialist, date and time/i)).toBeInTheDocument();
    expect(screen.getByTestId("location")).toHaveTextContent("/create-appointments");
  });
});
