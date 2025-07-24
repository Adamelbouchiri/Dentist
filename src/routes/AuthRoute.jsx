import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

import AppContext from "../context/AppProvider";

export const AuthRoute = () => {
  const { user, loadingUser } = useContext(AppContext);

  if (loadingUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <BounceLoader color="#3802ff" size={50} />
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
};
