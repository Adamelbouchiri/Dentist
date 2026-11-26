import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import AppContext from "../context/AppProvider";

export const patient = {
  id: 7,
  name: "Sara Alaoui",
  email: "sara@example.com",
  role: "user",
  created_at: "2026-01-10T10:00:00Z",
  second_registration_done: true,
};

export const admin = { ...patient, id: 1, name: "Admin", role: "admin" };

/** Renders the current pathname so tests can assert on redirects. */
export const LocationProbe = () => {
  const { pathname } = useLocation();
  return <div data-testid="location">{pathname}</div>;
};

/**
 * Render with React Query, a mocked auth context and a memory router.
 * `routes`: optional extra <Route> elements rendered alongside `path`.
 */
export const renderApp = (ui, { user = patient, route = "/", path = "*", routes = null } = {}) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity }, mutations: { retry: false } },
  });
  const ctx = {
    user,
    token: user ? "test-token" : null,
    loadingUser: false,
    setUser: () => {},
    setToken: () => {},
    signIn: () => {},
    signOut: () => {},
  };

  return {
    queryClient,
    ...render(
      <QueryClientProvider client={queryClient}>
        <AppContext.Provider value={ctx}>
          <MemoryRouter initialEntries={[route]}>
            <Routes>
              <Route path={path} element={ui} />
              {routes}
            </Routes>
            <LocationProbe />
          </MemoryRouter>
        </AppContext.Provider>
      </QueryClientProvider>
    ),
  };
};

/** Axios-style error with an HTTP status. */
export const httpError = (status, data = {}) => Object.assign(new Error(`HTTP ${status}`), { response: { status, data } });
