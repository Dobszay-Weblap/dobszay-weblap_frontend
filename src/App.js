import { Route, Routes } from "react-router-dom";
import "./App.css";
import Public from "./pages/Public";
import Layout from "./pages/Layout";
import Hazak from "./components/Hazak";

import Adatok from "./components/Adatok";
import KorabbiEv from "./components/Korabbiev";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import Szabalyok from "./components/Szabalyok";
import EtelekOsszesito from "./components/EtelekOsszesito";
import Ajanlatok from "./components/Ajanlatok";
import Etelek from "./components/Rendeles";

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


      </Route>
    </Routes>
  );
}

export default App;
