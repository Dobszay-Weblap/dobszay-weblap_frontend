import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { myAxios } from "./MyAxios";

export const AuthContext = createContext("");

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const csrf = async () => {
    await myAxios.get("/sanctum/csrf-cookie");
  };

  // Bejelentkezés
const login = async ({ email, password }) => {
  await csrf();
  try {
    const response = await myAxios.post("/api/login", { email, password }); // ⬅️ /api/login

    //console.log("Login response:", response.data);

    const token = response.data.token || response.data.access_token;
    const userData = response.data.user;

    if (!userData) {
      console.error("Nincs user adat a válaszban:", response.data);
      throw new Error("Hibás válasz a szervertől");
    }

    const normalizedGroups = userData.csoportok?.map((group) => ({
      id: group.id,
      nev: group.nev,
    })) || [];

    const userWithGroups = {
      ...userData,
      csoportok: normalizedGroups,
    };

    setUser(userWithGroups);
    setIsLoggedIn(true);
    localStorage.setItem('auth_token', token);
    myAxios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    return userWithGroups;

  } catch (error) {
    console.error("Login error:", error);
    console.error("Response data:", error.response?.data);
    throw error;
  }
};

  // Kijelentkezés
  const logout = async () => {
    await csrf();
    try {
      await myAxios.post("/api/logout");
    } catch (error) {
      console.log(error);
    } finally {
      setUser(null);
      setIsLoggedIn(false);
      localStorage.removeItem('auth_token');
      navigate("/");
    }
  };

  // Felhasználó lekérése token alapján
 const getUserData = async () => {
  const token = localStorage.getItem('auth_token');
  if (!token) return;

  try {
    const response = await myAxios.get("/api/user", {  // ⬅️ / előtag!
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const userData = response.data;

    const normalizedGroups = userData.csoportok?.map((group) => ({
      id: group.id,
      nev: group.nev,
    })) || [];

    setUser({
      ...userData,
      csoportok: normalizedGroups,
    });

    setIsLoggedIn(true);
    myAxios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } catch (error) {
    console.error("Hiba a felhasználói adatok lekérésekor:", error);
    if (error.response && error.response.status === 401) {
      logout();
    }
  }
};

  // Automatikus bejelentkeztetés ha van token
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      getUserData();
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        getUserData,
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
