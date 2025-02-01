import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router";
import { myAxios } from "./MyAxios";

export const AuthContext = createContext("");

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navigate = useNavigate();

  // CSRF cookie megszerzése
  const csrf = async () => {
    await myAxios.get("/sanctum/csrf-cookie");
  };

  // Bejelentkezés

const login = async ({ email, password }) => {
  try {
    // CSRF cookie beszerzése
    await myAxios.get("/sanctum/csrf-cookie");

    const { data } = await myAxios.post("/login", { email, password });

    if (data.user) {
      setUser(data.user);  // Felhasználói adatokat beállítjuk
      setIsLoggedIn(true);
      localStorage.setItem("access_token", data.access_token);
    } else {
      console.log("Nem található felhasználói adat a válaszban.");
    }
  } catch (error) {
    console.error("Bejelentkezési hiba:", error);
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