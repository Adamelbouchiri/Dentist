import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BounceLoader } from "react-spinners";
import AppContext from "../context/AppProvider";

export const GoogleAuthSuccess = () => {
  
  const {setToken} = useContext(AppContext);

  const navigate = useNavigate();

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");

    if (token) {
      localStorage.setItem("token", token);
      setToken(token);
      navigate("/"); // Redirect to home page instead of /dashboard
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <BounceLoader color="#3802ff" size={50} />
    </div>
  );
};

