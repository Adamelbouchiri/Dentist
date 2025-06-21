import { useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BounceLoader } from "react-spinners";
import AppContext from "../../context/AppProvider";


export const GoogleAuthSuccess = () => {
  
  const {setToken} = useContext(AppContext);

  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");

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

