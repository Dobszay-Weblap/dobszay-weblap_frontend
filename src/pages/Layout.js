import React, { useState, useEffect } from "react";
import { Link, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Nav, NavDropdown, Modal, Button, Alert } from "react-bootstrap";
import "./Layout.css";
import "../App.css";
import { useAuth } from "../contexts/AuthContext";
import KorabbiEv from "../components/public/Korabbiev";
import Adatok from "../components/public/Adatok";
import Hazak from "../components/public/Kaptalan/Hazak";
import Etelek from "../components/public/Kaptalan/Rendeles";
import Ajanlatok from "../components/public/Ajanlatok";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import { myAxios } from "../contexts/MyAxios";
import PasswordChangeFirst from "./PasswordChangeFirst";
import Szabalyok from "../components/public/Kaptalan/Szabalyok";
import EtelekOsszesito from "../components/public/Kaptalan/EtelekOsszesito";
import Felhasznalok from "../components/admin/Felhasznalok";
import Csolimpia from "../components/public/Kaptalan/Csolimpia";


const Layout = () => {
  const [showLogin, setShowLogin] = useState(false);
  const location = useLocation();
  const { user, login, logout } = useAuth(); 
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Bejelentkezési művelet
  const handleLogin = async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    
    if (!email || !password) {
      setLoginError("Kérlek töltsd ki az összes mezőt!");
      return;
    }
    
    setLoginError(null); // Töröljük az előző hibát
    setIsLoading(true);
    
    //console.log("Küldendő adatok:", { email, password });
    
    try {
      await login({ email, password });
      setShowLogin(false);
      setLoginError(null);
    } catch (error) {
      console.error("Bejelentkezési hiba:", error);
      
      // Hibaüzenet beállítása
      if (error.response) {
        if (error.response.status === 401) {
          setLoginError("Hibás email cím vagy jelszó!");
        } else if (error.response.status === 422) {
          setLoginError("Kérlek töltsd ki helyesen az összes mezőt!");
        } else {
          setLoginError("Hiba történt a bejelentkezés során. Próbáld újra!");
        }
      } else if (error.request) {
        setLoginError("Nem sikerült kapcsolódni a szerverhez!");
      } else {
        setLoginError("Váratlan hiba történt!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUserDetails(null);
    setShowPasswordModal(false);
  };

  // Ellenőrizzük, hogy kell-e jelszót változtatni
  useEffect(() => {
    if (user) {
      myAxios.get("/api/user").then((res) => {
        setUserDetails(res.data);
        // Ha password_changed false vagy null, akkor megjelenik a modal
        if (!res.data.password_changed) {
          setShowPasswordModal(true);
        }
      }).catch((error) => {
        console.error("Hiba a user adatok lekérésekor:", error);
      });
    }
  }, [user]);
  

  const handleForgotPassword = () => {
    navigate("/elfelejtett-jelszo");
    setShowLogin(false);
    setLoginError(null);
  };

  // ⬇️ ÚJ: Modal megnyitásakor töröljük a hibát
  const handleShowLogin = () => {
    setShowLogin(true);
    setLoginError(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Dobszay család</h1>
      </header>

      <div className="elsonezet">
        <div className="navok">
          <Nav style={{ display: "flex", gap: "0" }}>
            {user ? (
              <>
                <Nav.Item>
                  <Link to="#" className="nav-link" onClick={handleLogout}>
                    Kijelentkezés
                  </Link>
                </Nav.Item>
              </>
            ) : (
              <Nav.Item>
                <Link to="#" className="nav-link" onClick={handleShowLogin}>
                  Bejelentkezés
                </Link>
              </Nav.Item>
            )}
            {(user?.jogosultsagi_szint === "felhasznalo" || user?.jogosultsagi_szint === "admin") && (
              <>
                <NavDropdown title="Káptalan" id="kaptalan-dropdown">
                  <NavDropdown.Item as={Link} to="/etelek">Étel</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/hazak">Házak</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/csolimpia">Csolimpia</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/sortablazat">Sörtáblázat</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/szabalyok">Szabályok</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/eszkozok">Eszköz hozó</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/kozkaja">Közkaja közpénz</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/asztal">Terülj terülj asztalkám</NavDropdown.Item>
                </NavDropdown>

                <Nav.Item>
                  <Link to="/adatok" className="nav-link">
                    Adatok
                  </Link>
                </Nav.Item>

                <NavDropdown title="Korábbi évek" id="korabbiev-dropdown">
                  <NavDropdown.Item as={Link} to="/korabbiev/2023">2023</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/korabbiev/2022">2022</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/korabbiev/2021">2021</NavDropdown.Item>
                </NavDropdown>

                {user?.email === "dorka@gmail.hu" && (
                  <Nav.Item>
                    <Link to="/ajanlatok" className="nav-link">
                      Családi ajánlatok
                    </Link>
                  </Nav.Item>
                )}
              </>
            )}
            {(user?.jogosultsagi_szint === "nezo" || user?.jogosultsagi_szint === "admin") && (
              <Nav.Item>
                <Link to="/etelosszesito" className="nav-link">
                  Összesítő
                </Link>
              </Nav.Item>
            )}

            {user?.jogosultsagi_szint === "admin" && (
              <Nav.Item>
                <Link to="/felhasznalok" className="nav-link">
                  Felhasználók
                </Link>
              </Nav.Item>
            )}
          </Nav>
        </div>

        {/* Bejelentkezési modal */}
        <Modal show={showLogin} onHide={() => { setShowLogin(false); setLoginError(null); }}>
          <Modal.Header closeButton>
            <Modal.Title>Bejelentkezés</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* ⬇️ ÚJ: Hibaüzenet megjelenítése */}
            {loginError && (
              <Alert variant="danger" onClose={() => setLoginError(null)} dismissible>
                {loginError}
              </Alert>
            )}
            
            <input 
              id="email" 
              type="email" 
              placeholder="Email" 
              className="form-control mb-2"
              disabled={isLoading}
            />
            <input 
              id="password" 
              type="password" 
              placeholder="Jelszó" 
              className="form-control"
              disabled={isLoading}
            />
            <button onClick={handleForgotPassword} className="btn btn-link" disabled={isLoading}>
              Elfelejtett jelszó?
            </button>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => { setShowLogin(false); setLoginError(null); }} disabled={isLoading}>
              Bezárás
            </Button>
            <Button variant="primary" onClick={handleLogin} disabled={isLoading}>
              {isLoading ? "Bejelentkezés" : "Belépés"}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Az aloldalak tartalma */}
        <div className="oldaltartalom">
          <Routes>
            <Route path="/korabbiev/:year" element={<KorabbiEv />} />
            <Route path="/adatok" element={<Adatok />} />
            <Route path="/hazak" element={<Hazak />} />
            <Route path="/ajanlatok" element={<Ajanlatok />} />
            <Route path="/etelek" element={<Etelek />} />
            <Route path="/etelosszesito" element={<EtelekOsszesito />} />
            <Route path="/szabalyok" element={<Szabalyok />} />
            <Route path="/elfelejtett-jelszo" element={<ForgotPassword />} />
            <Route path="/password-reset" element={<ResetPassword />} />
            <Route path="/felhasznalok" element={<Felhasznalok />} />
            <Route path="/csolimpia" element={<Csolimpia />} />
          </Routes>
        </div>
      </div>
      
      {location.pathname === "/" && (
        <div className="kezdokep">
          <img src="kepek/nagycsalad.jpg" alt="Család" />
        </div>
      )}

      {/* Első bejelentkezés - jelszóváltoztatás modal */}
      {userDetails && (
        <PasswordChangeFirst
          show={showPasswordModal}
          onHide={() => setShowPasswordModal(false)}
          onPasswordChanged={() => {
            setShowPasswordModal(false);
            setUserDetails({ ...userDetails, password_changed: true });
          }}
        />
      )}

      <footer>
        <p>@Minden jog fenntartva!</p>
      </footer>
    </div>
  );
};

export default Layout;