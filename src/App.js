import { Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./pages/Layout";
import Adatok from "./components/public/Adatok";
import Etelek from "./components/public/Kaptalan/Rendeles";
import EtelekOsszesito from "./components/public/Kaptalan/EtelekOsszesito";
import Ajanlatok from "./components/public/Ajanlatok";
import Szabalyok from "./components/public/Kaptalan/Szabalyok";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import KorabbiEv from "./components/public/Korabbiev";
import Felhasznalok from "./components/admin/Felhasznalok";
import Csolimpia from "./components/public/Kaptalan/Csolimpia";
import KaptalanHazak from "./components/public/Kaptalan/KaptalanHazak";
import MasikHazak from "./components/public/Kaptalan/MasikHazak";



function App() {
  return (
    <Routes>
      <Route path="/*" element={<Layout />}>
        <Route path="kaptalanhazak" element={<KaptalanHazak />} />
        <Route path="masikhazak" element={<MasikHazak />} />
        <Route path="adatok" element={<Adatok />} />
        <Route path="etelek" element={<Etelek />} />
        <Route path="etelosszesito" element={<EtelekOsszesito />} />
        <Route path="ajanlatok" element={<Ajanlatok />} />
        <Route path="szabalyok" element={<Szabalyok />} />
        <Route path="elfelejtett-jelszo" element={<ForgotPassword />} />
        <Route path="password-reset" element={<ResetPassword />} />
        <Route path="korabbiev/:year" element={<KorabbiEv />} />
        <Route path="felhasznalok" element={<Felhasznalok />} />
        <Route path="csolimpia" element={<Csolimpia />} />


      </Route>
    </Routes>
  );
}

export default App;
