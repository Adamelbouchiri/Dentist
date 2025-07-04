import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

import AppContext  from "../context/AppProvider";

export const GuestRoute = () => {
  const { user } = useContext(AppContext);

  return !user ? <Outlet /> : <Navigate to="/" />;
};
