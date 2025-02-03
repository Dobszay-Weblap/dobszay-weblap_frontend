import { Route, Routes } from 'react-router-dom';
import './App.css';
import Public from './pages/Public';
import Layout from './pages/Layout';
import Admin from './pages/admin/Admin';
import Hazak from './components/Hazak';
import Adatok from './components/Adatok';



function App() {
  return (
<Routes>
  <Route path="/" element={<Layout />}>
  <Route path="/*" element={<Public />} />
    <Route path="hazak" element={<Hazak />} />
    <Route path="admin" element={<Admin />} />
      <Route path="adatok" element={<Adatok />} />


  </Route>
</Routes>



  );
}

export default App;
