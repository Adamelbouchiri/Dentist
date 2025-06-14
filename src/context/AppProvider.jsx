import axios from "axios";
import { createContext, useEffect, useState } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  async function getUser() {
    const response = await axios.get("http://127.0.0.1:8000/api/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = response.data;
    setUser(data);
    console.log(user);
  }

  useEffect(() => {
    if (token) {
      getUser();
    }
  }, [token]);

  console.log(user);

  return (
    <AppContext.Provider value={{ token, setToken, user }}>
      {children}
    </AppContext.Provider>
  );
}

export default AppContext;
