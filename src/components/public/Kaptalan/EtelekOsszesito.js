import React, { useState, useEffect } from "react";
import { myAxios } from "../../../contexts/MyAxios";
import "./Etelek.css";

const EtelekOsszesito = () => {
  const [menuk, setMenuk] = useState([]);
  const [etelek, setEtelek] = useState([]);
  const [kezdoDatum, setKezdoDatum] = useState("");
  const [loading, setLoading] = useState(false);

  // Generálunk 7 napot a kezdő dátumból
  const datumok = kezdoDatum
    ? Array.from({ length: 7 }, (_, i) => {
        const d = new Date(kezdoDatum);
        d.setDate(d.getDate() + i);
        return d.toISOString().split("T")[0];
      })
    : [];

  // Adatok betöltése
  useEffect(() => {
    const betoltAdatok = async () => {
      setLoading(true);
      try {
        const [datumRes, menukRes, etelekRes] = await Promise.all([
          myAxios.get('/api/kezdo-datum'),
          myAxios.get("/api/menus"),
          myAxios.get("/api/etelek")
        ]);
        
        setKezdoDatum(datumRes.data.kezdoDatum);
        setMenuk(menukRes.data);
        setEtelek(etelekRes.data);
      } catch (err) {
        console.error("Betöltési hiba:", err);
      } finally {
        setLoading(false);
      }
    };

    betoltAdatok();
    
    // Automatikus frissítés 30 másodpercenként
    const interval = setInterval(betoltAdatok, 30000);
    return () => clearInterval(interval);
  }, []);

  // Napi összesítés
  const getNapiOsszesites = () => {
    return datumok.map(datum => {
      const napiEtelek = etelek.filter(e => e.datum === datum);
      return {
        datum,
        A: napiEtelek.reduce((sum, e) => sum + (Number(e.adag_A) || 0), 0),
        B: napiEtelek.reduce((sum, e) => sum + (Number(e.adag_B) || 0), 0),
        C: napiEtelek.reduce((sum, e) => sum + (Number(e.adag_C) || 0), 0),
        osszes: napiEtelek.reduce(
          (sum, e) => sum + (Number(e.adag_A) || 0) + (Number(e.adag_B) || 0) + (Number(e.adag_C) || 0),
          0
        )
      };
    });
  };

  // Csoport szerinti összesítés
  const getCsoportOsszesites = () => {
    const csoportok = {};
    
    etelek.forEach(etel => {
      const nev = etel.nev;
      if (!csoportok[nev]) {
        csoportok[nev] = {
          A: 0,
          B: 0,
          C: 0,
          osszes: 0
        };
      }
      
      csoportok[nev].A += Number(etel.adag_A) || 0;
      csoportok[nev].B += Number(etel.adag_B) || 0;
      csoportok[nev].C += Number(etel.adag_C) || 0;
      csoportok[nev].osszes += (Number(etel.adag_A) || 0) + (Number(etel.adag_B) || 0) + (Number(etel.adag_C) || 0);
    });

    return Object.entries(csoportok)
      .map(([nev, adatok]) => ({ nev, ...adatok }))
      .sort((a, b) => b.osszes - a.osszes);
  };

  const napiOsszesites = getNapiOsszesites();
  const csoportOsszesites = getCsoportOsszesites();

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Betöltés...</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto', backgroundColor:'lightblue', borderBottomLeftRadius:'15px', borderBottomRightRadius:'15px'}}>
      <h2 style={{ marginBottom: '30px', fontSize:'50px', fontWeight:'bolder' }}>Ételek Összesítő</h2>

      {/* Napi összesítés */}
      <div style={{ marginBottom: '40px' }}>
        <h3>Napi Összesítés</h3>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse', 
          backgroundColor: 'white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Dátum</th>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Főétel A</th>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Főétel B</th>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Főétel C</th>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #ddd', fontWeight: 'bold' }}>Összesen</th>
            </tr>
          </thead>
          <tbody>
            {napiOsszesites.map((nap, index) => (
              <tr key={nap.datum} style={{ 
                backgroundColor: index % 2 === 0 ? 'white' : '#fafafa',
                borderBottom: '1px solid #eee'
              }}>
                <td style={{ padding: '12px' }}>{nap.datum}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>{nap.A}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>{nap.B}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>{nap.C}</td>
                <td style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', backgroundColor: '#fff9c4' }}>
                  {nap.osszes}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Csoport szerinti összesítés */}
      <div>
        <h3>Összesítés Név szerint</h3>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse', 
          backgroundColor: 'white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Név</th>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Főétel A</th>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Főétel B</th>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Főétel C</th>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #ddd', fontWeight: 'bold' }}>Összesen</th>
            </tr>
          </thead>
          <tbody>
            {csoportOsszesites.map((csoport, index) => (
              <tr key={csoport.nev} style={{ 
                backgroundColor: index % 2 === 0 ? 'white' : '#fafafa',
                borderBottom: '1px solid #eee'
              }}>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>{csoport.nev}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>{csoport.A}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>{csoport.B}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>{csoport.C}</td>
                <td style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', backgroundColor: '#c8e6c9' }}>
                  {csoport.osszes}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EtelekOsszesito;