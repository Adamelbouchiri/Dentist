import { useContext, useEffect } from "react";
import { BounceLoader } from "react-spinners";

import { useNavigate } from "react-router-dom";
import AppContext from "../../context/AppProvider";

export const FacebookAuthSuccess = () => {

  const {setToken} = useContext(AppContext);

  const navigate = useNavigate();

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");

    if (token) {
      localStorage.setItem("token", token);
      setToken(token);
      navigate("/");
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
