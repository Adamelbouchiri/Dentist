import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

import AppContext from "../context/AppProvider";
import { PageLoader } from "../components/ui/Spinner";

export const GuestRoute = () => {
  const { user, loadingUser } = useContext(AppContext);

  if (loadingUser) return <PageLoader />;

  return !user ? <Outlet /> : <Navigate to="/" replace />;
};
