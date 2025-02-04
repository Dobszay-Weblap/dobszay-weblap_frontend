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
          const accessToken = response.data.access_token;
            setUser(response.data.user);
            setToken(accessToken);
            setIsLoggedIn(true);
            localStorage.setItem("access_token", accessToken);
          } catch (error) {
            console.error('Hiba a bejelentkezéskor:', error.response?.data?.message || error.message);
          }

    };
    
    // Kijelentkezés
    const logout = async () => {
      await csrf();
      try {
        await myAxios.post("/logout");
      } catch (error) {
        console.log(error);
        }
        finally {
        setUser(null);
        setIsLoggedIn(false);
        localStorage.removeItem("access_token");
        navigate("/");  // Kijelentkezés után navigálás a bejelentkezési oldalra
      } 
      }

const getUserData = async () => {
  const token = localStorage.getItem('access_token');
  if (!token) return;
    try {
      const response = await myAxios.get('http://localhost:8000/api/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
      setIsLoggedIn(true);
      console.log('Felhasználói adat:', response.data); // A válasz itt jön
    } catch (error) {
      console.error('Hiba a felhasználói adatok lekérésekor:', error);
      logout(); 
    }
  }

useEffect(() => {
  const token = localStorage.getItem("access_token");
  if (token) {
    getUserData(); // Ha van token, próbáljuk lekérni a felhasználói adatokat
  } else {
    setIsLoggedIn(false); // Ha nincs token, a felhasználó nincs bejelentkezve
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