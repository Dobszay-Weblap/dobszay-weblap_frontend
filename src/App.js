import { Route, Routes } from "react-router-dom";
import "./App.css";
import Public from "./pages/Public";
import Layout from "./pages/Layout";
import Hazak from "./components/public/Hazak";
import Adatok from "./components/public/Adatok";
import Etelek from "./components/public/Rendeles";
import EtelekOsszesito from "./components/public/EtelekOsszesito";
import Ajanlatok from "./components/public/Ajanlatok";
import Szabalyok from "./components/public/Szabalyok";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import KorabbiEv from "./components/public/Korabbiev";
import Felhasznalok from "./components/admin/Felhasznalok";



function App() {
  return (
    <Routes>
      <Route path="/*" element={<Layout />}>
        <Route index element={<Public />} />

        <Route path="hazak" element={<Hazak />} />
        <Route path="adatok" element={<Adatok />} />
        <Route path="etelek" element={<Etelek />} />
        <Route path="etelosszesito" element={<EtelekOsszesito />} />
        <Route path="ajanlatok" element={<Ajanlatok />} />
        <Route path="szabalyok" element={<Szabalyok />} />
        <Route path="elfelejtett-jelszo" element={<ForgotPassword />} />
        <Route path="password-reset" element={<ResetPassword />} />
        <Route path="korabbiev/:year" element={<KorabbiEv />} />
        <Route path="felhasznalok" element={<Felhasznalok />} />


      </Route>
    </Routes>
  );
}

export default App;
