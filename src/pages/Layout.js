import React, { useState, useEffect } from "react";
import { Link, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Nav, NavDropdown, Modal, Button } from "react-bootstrap";
import "./Layout.css";
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
  const [backgroundImage, setBackgroundImage] = useState("/images/default-background.jpg"); // Kezdeti háttérkép
  const location = useLocation();
  const { user, login, logout } = useAuth(); 
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [userDetails, setUserDetails] = useState(null); // részletes user-adatok

  const navigate = useNavigate();


  

  // Bejelentkezési művelet
  const handleLogin = async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    if (!email || !password) {
      console.log("Email vagy jelszó hiányzik!");
      return;
    }
    
    console.log("Küldendő adatok:", { email, password });
    
    try {
      // A login most már visszaadja a user adatokat
      await login({ email, password });
      
      setShowLogin(false);
      setBackgroundImage("/images/user-logged-in-background.jpg");
      
    } catch (error) {
      console.error("Bejelentkezési hiba:", error);
    }
  };


  const handleLogout = () => {
    logout(); // Kijelentkezés
    setBackgroundImage("/images/default-background.jpg"); // Kijelentkezéskor visszaállítjuk az alap háttérképet
  };


  useEffect(() => {
    if (user) {
      myAxios.get("/api/user").then((res) => {
        setUserDetails(res.data);
        if (!res.data.password_changed) {
          setShowPasswordModal(true);
        }
      });
    }
  }, [user]);
  
  
  useEffect(() => {
    if (user) {
      // Ha van bejelentkezett felhasználó, más háttérkép jelenik meg
      setBackgroundImage("/images/user-logged-in-background.jpg");
    } else {
      // Ha nincs bejelentkezve, az alap háttérkép jelenik meg
      setBackgroundImage("/images/default-background.jpg");
    }
  }, [user]);


  const handleForgotPassword = () => {
    navigate("/elfelejtett-jelszo");
    setShowLogin(false); // A megfelelő oldalra navigálás
  };
  return (
    <div className="App" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover' }}>
      <header className="App-header">
        <h1>Dobszay család</h1>
      </header>

      <div className="elsonezet">
        <div className="navok">
          <Nav style={{ display: "flex", gap: "0" }}>
            {/* Ha nincs bejelentkezve, mutassuk a bejelentkezési gombot */}
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
                <Link to="#" className="nav-link" onClick={() => setShowLogin(true)}>
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
                  <Link to="/adatok" className="nav-link" >
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
                  <Link to="/ajanlatok" className="nav-link" >
                    Családi ajánlatok
                  </Link>
                </Nav.Item>
                )}
              </>
            )}
            {(user?.jogosultsagi_szint === "nezo" || user?.jogosultsagi_szint === "admin") && (
              <Nav.Item>
                <Link to="/etelosszesito" className="nav-link" >
                  Összesítő
                </Link>
              </Nav.Item>
            )}

        { user?.jogosultsagi_szint === "admin" && (
                    <Nav.Item>
                          <Link to="/felhasznalok" className="nav-link" >
                            Felhasználók
                          </Link>
                        </Nav.Item>
        )}
          </Nav>
        </div>

        {/* Bejelentkezési modal */}
        <Modal show={showLogin} onHide={() => setShowLogin(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Bejelentkezés</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input id="email" type="text" placeholder="Email" className="form-control mb-2" />
            <input id="password" type="password" placeholder="Jelszó" className="form-control" />
            <button onClick={handleForgotPassword} className="btn btn-link">
            Elfelejtett jelszó?
          </button>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowLogin(false)}>
              Bezárás
            </Button>
            <Button variant="primary" onClick={handleLogin}>
              Belépés
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
                    
            {/* További route-ok ide kerülhetnek */}
          </Routes>
        </div>
      </div>
      
      {location.pathname === "/" && (
        <div className="kezdokep">
          <img src="kepek/nagycsalad.jpg" alt="Család" />
        </div>
      )}

      

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
