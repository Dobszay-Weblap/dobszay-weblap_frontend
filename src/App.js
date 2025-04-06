import { Route, Routes } from 'react-router-dom';
import './App.css';
import Public from './pages/Public';
import Layout from './pages/Layout';
import Hazak from './components/Hazak';
import Etelek from './components/Etelek';
import Adatok from './components/Adatok';
import KorabbiEv from './components/Korabbiev';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword';



function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/*" element={<Public />} />
        <Route path="hazak" element={<Hazak />} />
        <Route path="adatok" element={<Adatok />} />
        <Route path="etelek" element={<Etelek />} />
        <Route path="/elfelejtett-jelszo" element={<ForgotPassword />} />
        <Route path="/password-reset" element={<ResetPassword />} />
        
        {/* Útvonal a korábbi évekhez */}
        <Route path="korabbiev/:year" element={<KorabbiEv />} />
      </Route>
    </Routes>
  );
}

export default App;
