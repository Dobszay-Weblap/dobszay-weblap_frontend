import { Link, Outlet } from "react-router-dom";
import { Container, Nav } from "react-bootstrap";

export default function Admin() {
  return (
    <Container>
      <Nav style={{ display: "flex", gap: "0" }}>
        <Nav.Item>
          <Link
            to="/admin/vizilenyekurlap"
            className="nav-link"
            style={{ fontWeight: "bold", textDecoration: "none" }} // Félkövér és link aláhúzás eltávolítása
            onMouseOver={(e) => (e.target.style.textDecoration = "underline")} // Hover: aláhúzás
            onMouseOut={(e) => (e.target.style.textDecoration = "none")} // Hover elhagyáskor: aláhúzás eltávolítása
          >
            Vízilények
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link
            to="/admin/cikkekurlap"
            className="nav-link"
            style={{ fontWeight: "bold", textDecoration: "none" }} 
            onMouseOver={(e) => (e.target.style.textDecoration = "underline")} 
            onMouseOut={(e) => (e.target.style.textDecoration = "none")} 
          >
            Cikkek
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link
            to="/admin/esemenyekurlap"
            className="nav-link"
            style={{ fontWeight: "bold", textDecoration: "none" }} // Félkövér és link aláhúzás eltávolítása
            onMouseOver={(e) => (e.target.style.textDecoration = "underline")} // Hover: aláhúzás
            onMouseOut={(e) => (e.target.style.textDecoration = "none")} // Hover elhagyáskor: aláhúzás eltávolítása
          >
            Események
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link
            to="/admin/videokurlap"
            className="nav-link"
            style={{ fontWeight: "bold", textDecoration: "none" }} // Félkövér és link aláhúzás eltávolítása
            onMouseOver={(e) => (e.target.style.textDecoration = "underline")} // Hover: aláhúzás
            onMouseOut={(e) => (e.target.style.textDecoration = "none")} // Hover elhagyáskor: aláhúzás eltávolítása
          >
            Videók
          </Link>
        </Nav.Item>
      </Nav>
      <div className="content">
        <Outlet />
      </div>
    </Container>
  );
}