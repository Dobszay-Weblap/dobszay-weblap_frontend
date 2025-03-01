import React, { useState, useEffect } from "react";
import { Link, Routes, Route, useLocation } from "react-router-dom";
import { Nav, NavDropdown, Modal, Button } from "react-bootstrap";
import "./Layout.css";
import { useAuth } from "../contexts/AuthContext";
import KorabbiEv from "../components/Korabbiev";
import Adatok from "../components/Adatok";
import Hazak from "../components/Hazak";
import Etelek from "../components/Etelek";
import Ajanlatok from "../components/Ajanlatok";


const Layout = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState("/images/default-background.jpg"); // Kezdeti háttérkép
  const location = useLocation();
  const { user, login, logout } = useAuth(); // AuthContextből bejelentkezés és kijelentkezés funkciók

  // Bejelentkezési művelet
  const handleLogin = async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    if (!email || !password) {
      console.log("Email vagy jelszó hiányzik!");
      return;
    }
    console.log("Küldendő adatok:", { email, password }); // Debugging
    await login({ email, password });
    setShowLogin(false); // Modal bezárása sikeres bejelentkezés után
    setBackgroundImage("/images/user-logged-in-background.jpg"); // Bejelentkezés utáni háttérkép
  };

  const handleLogout = () => {
    logout(); // Kijelentkezés
    setBackgroundImage("/images/default-background.jpg"); // Kijelentkezéskor visszaállítjuk az alap háttérképet
  };

  useEffect(() => {
    if (user) {
      // Ha van bejelentkezett felhasználó, más háttérkép jelenik meg
      setBackgroundImage("/images/user-logged-in-background.jpg");
    } else {
      // Ha nincs bejelentkezve, az alap háttérkép jelenik meg
      setBackgroundImage("/images/default-background.jpg");
    }
  }, [user]);

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
            {user?.jogosultsagi_szint === "felhasznalo" && (
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
{user?.jogosultsagi_szint === "nezo" && (
            <Nav.Item>
                  <Link to="/etelek" className="nav-link" >
                    Étel
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
            <Route path="/adatok" element={<Adatok />} /> {/* Adatok oldal */}
            <Route path="/hazak" element={<Hazak />} />
            <Route path="/ajanlatok" element={<Ajanlatok />} />
            <Route path="/etelek" element={<Etelek />} />
            {/* További route-ok ide kerülhetnek */}
          </Routes>
        </div>
      </div>
      
      {location.pathname === "/" && (
        <div className="kezdokep">
          <img src="kepek/nagycsalad.jpg" alt="Család" />
        </div>
      )}

      

      <footer>
        <p>@Minden jog fenntartva!</p>
      </footer>
    </div>
  );
};

export default Layout;
