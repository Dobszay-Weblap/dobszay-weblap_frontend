import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Nav, NavDropdown, Modal, Button } from "react-bootstrap";
import "./Layout.css";
import { useAuth } from "../contexts/AuthContext";

const Layout = () => {
  const [showLogin, setShowLogin] = useState(false);
  const location = useLocation();
  const { user, login, logout } = useAuth(); // AuthContextből bejelentkezés és kijelentkezés funkciók

  // Bejelentkezési művelet (teszt célra, élesben backend hívás kell)
  const handleLogin = () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    if (!email || !password) {
      console.log("Email vagy jelszó hiányzik!");
      return;
    }
    console.log("Küldendő adatok:", { email, password }); // Debugging
    login({ email, password });
    setShowLogin(false); // Modal bezárása sikeres bejelentkezés után
  };

  // useEffect hook a felhasználó adatainak követésére
  useEffect(() => {
    console.log("Felhasználó változott: ", user);
  }, [user]); // Figyeljük a `user` változást

  return (
    <div className="App">
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
                      <Link to="#" className="nav-link" onClick={logout}>
                        Kijelentkezés ({user.nev})
                      </Link>
                    </Nav.Item>
                    {/* Egyéb navigációs elemek a bejelentkezett felhasználóknak */}
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
                  <NavDropdown.Item as={Link} to="/hazak">Házak</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/korabbiev/2022">2022</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/korabbiev/2021">2021</NavDropdown.Item>
                </NavDropdown>

                <Nav.Item>
                  <Link to="/adatok" className="nav-link">Adatok</Link>
                </Nav.Item>

                <NavDropdown title="Korábbi évek" id="korabbiev-dropdown">
                  <NavDropdown.Item as={Link} to="/korabbiev/2023">2023</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/korabbiev/2022">2022</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/korabbiev/2021">2021</NavDropdown.Item>
                </NavDropdown>
              </>
            )}
          </Nav>
        </div>

        {/* Bejelentkezési modal */}
        <Modal show={showLogin} onHide={() => setShowLogin(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Bejelentkezés</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input
              id="email"
              type="text"
              placeholder="Email"
              className="form-control mb-2"
            />
            <input
              id="password"
              type="password"
              placeholder="Jelszó"
              className="form-control"
            />
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

        {/* Csak akkor jelenjen meg a nagy kép, ha az útvonal "/" (főoldal) */}
        {location.pathname === "/" && (
          <div className="kezdokep">
            <img src="kepek/nagycsalad.jpg" alt="Család" />
          </div>
        )}

        {/* Az aloldalak tartalma */}
        <div className="oldaltartalom">
          <Outlet />
        </div>
      </div>

      <footer>
        <p>@Minden jog fenntartva!</p>
      </footer>
    </div>
  );
};

export default Layout;
