import { Route, Routes } from 'react-router-dom';
import './App.css';
import Public from './pages/Public';
import Layout from './pages/Layout';
import Admin from './pages/admin/Admin';
import Hazak from './components/public/Hazak';
import Adatok from './components/public/Adatok';
import KorabbiEv from './components/public/Korabbiev';
import Etelek from './components/public/Etelek';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/*" element={<Public />} />
        <Route path="hazak" element={<Hazak />} />
        <Route path="adatok" element={<Adatok />} />
        <Route path="etelek" element={<Etelek />} />
        
        {/* Útvonal a korábbi évekhez */}
        <Route path="korabbiev/:year" element={<KorabbiEv />} />
      </Route>
    </Routes>
  );
}

export default App;
