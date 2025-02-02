import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router";
import { myAxios } from "./MyAxios";

export const AuthContext = createContext("");

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navigate = useNavigate();

  const csrf = async () => {
    await myAxios.get("/sanctum/csrf-cookie");
  };
  
  //bejelenkezés
  const login = async ({ email, password }) => {
    await csrf(); // A CSRF cookie beszerzése
    try {
      const { data } = await myAxios.post("/login", { email, password });
      setUser(data.user);
      setIsLoggedIn(true);
      console.log("Backend válasz:", data);
      localStorage.setItem("access_token", data.token);
      
    } catch (error) {
      console.error("Bejelentkezési hiba:", error.response ? error.response.data : error.message);
    }
  };

  const getUser = async () => {
    try {
      const { data } = await myAxios.get("/user");
      setUser(data);      
    } catch (error) {
      console.log(
        "Felhasználó lekérdezési hiba:",
        error.response ? error.response.data : error.message
      );
    }
  };
  
  // Kijelentkezés
  const logout = async () => {
    await csrf();
    try {
      await myAxios.post("/logout");
      setUser(null);  // Kijelentkezés után töröljük a user adatokat
      setIsLoggedIn(false);
      localStorage.removeItem("access_token");
      navigate("/bejelentkezes");
    } catch (error) {
      console.log(error);
    }
  };
  

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        login,
        user,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}