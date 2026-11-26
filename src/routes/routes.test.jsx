import { describe, expect, it } from "vitest";
import { Route } from "react-router-dom";
import { screen } from "@testing-library/react";
import { AuthRoute } from "./AuthRoute";
import { GuestRoute } from "./GuestRoute";
import { DashboardShell } from "../components/dashboard/DashboardShell";
import { admin, patient, renderApp } from "../test/utils";

const Secret = () => <p>secret page</p>;

describe("route guards", () => {
  it("sends guests from a protected page to /login", () => {
    renderApp(<AuthRoute />, {
      user: null,
      route: "/user/dashboard",
      path: "/",
      routes: (
        <>
          <Route element={<AuthRoute />}>
            <Route path="/user/dashboard" element={<Secret />} />
          </Route>
          <Route path="/login" element={<p>login page</p>} />
        </>
      ),
    });
    expect(screen.getByTestId("location")).toHaveTextContent("/login");
    expect(screen.queryByText("secret page")).not.toBeInTheDocument();
  });

  it("lets signed-in users through", () => {
    renderApp(null, {
      user: patient,
      route: "/user/dashboard",
      path: "/",
      routes: (
        <Route element={<AuthRoute />}>
          <Route path="/user/dashboard" element={<Secret />} />
        </Route>
      ),
    });
    expect(screen.getByText("secret page")).toBeInTheDocument();
  });

  it("bounces signed-in users away from /login", () => {
    renderApp(null, {
      user: patient,
      route: "/login",
      path: "/",
      routes: (
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<p>login page</p>} />
        </Route>
      ),
    });
    expect(screen.getByTestId("location")).toHaveTextContent(/^\/$/);
  });

  it("keeps patients out of the admin dashboard", () => {
    renderApp(<DashboardShell role="admin" label="Admin" items={[]} />, { user: patient, route: "/admin/dashboard" });
    expect(screen.getByTestId("location")).toHaveTextContent(/^\/$/);
  });

  it("renders the admin shell for admins", () => {
    renderApp(<DashboardShell role="admin" label="Admin" items={[]} />, { user: admin, route: "/admin/dashboard" });
    expect(screen.getByTestId("location")).toHaveTextContent("/admin/dashboard");
    expect(screen.getAllByText("Admin").length).toBeGreaterThan(0);
  });
});
