import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { BounceLoader } from "react-spinners";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || sessionStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  // const [loading, setLoading] = useState(false);

  async function getUser() {
    // setLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = response.data;
    setUser(data);
    } catch (error) {
      console.error(error);
    } finally {
      // setLoading(false);
      setLoadingUser(false);
    }
  }

  useEffect(() => {
    if (token) {
      getUser();
    } else {
      // setLoading(false)
      setLoadingUser(false);
    }
  }, [token]);

  console.log(user);

  if(loadingUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <BounceLoader color="#3802ff" size={50}/>
      </div>
    )
  }

  return (
    <AppContext.Provider value={{ token, setToken, user, setUser, loadingUser }}>
      {children}
    </AppContext.Provider>
  );
}

export default AppContext;
