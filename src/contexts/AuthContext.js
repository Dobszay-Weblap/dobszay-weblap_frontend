import { createContext, useContext,useEffect,useState } from "react";
import { useNavigate } from "react-router";
import { myAxios } from "./MyAxios";

export const AuthContext = createContext("");

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const navigate = useNavigate();

  const csrf = async () => {
    await myAxios.get("/sanctum/csrf-cookie");
  };
  
    // Bejelentkezés
    const login = async ({ email, password }) => {
      await csrf();
      try {
          const response = await myAxios.post('http://localhost:8000/api/login', {
            email: email,
            password: password,
          });
          setUser(response.data.user);  // Elmentjük a felhasználót
          setToken(response.data.access_token);  // Elmentjük a tokent
          localStorage.setItem('access_token', response.data.token);
          getUserData();
          } catch (error) {
            console.error('Hiba a bejelentkezéskor:', error.response?.data?.message || error.message);
          }

    };
    
    // Kijelentkezés
    const logout = async () => {
      await csrf();
      try {
        await myAxios.post("/logout");
        setUser(null);
        setIsLoggedIn(false);
        localStorage.removeItem("access_token");
        navigate("/");  // Kijelentkezés után navigálás a bejelentkezési oldalra
      } catch (error) {
        console.log(error);
      }
    };


const getUserData = async () => {
  const token = localStorage.getItem('access_token');
  if (token) {
    try {
      const response = await myAxios.get('http://localhost:8000/api/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Felhasználói adat:', response.data); // A válasz itt jön
    } catch (error) {
      console.error('Hiba a felhasználói adatok lekérésekor:', error);
    }
  }
};

useEffect(() => {
  getUserData(); // Ez fogja meghívni az API-t
}, []); // Az üres tömb biztosítja, hogy csak egyszer fusson le

  

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