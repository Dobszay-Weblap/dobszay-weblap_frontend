import React, { useState, useEffect } from "react";

import "./Etelek.css"; // Stílus a kinézethez
import { myAxios } from "../contexts/MyAxios";
import { useAuth } from "../contexts/AuthContext";

const Etelek = () => {
  const [etelek, setEtelek] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newValues, setNewValues] = useState({});
  const {user} = useAuth();

  useEffect(() => {
    myAxios.get("/api/etelek").then((res) => {
      // Minden mező alapértelmezetten 0, kivéve a "leves" oszlopot, ami üres
      const updatedData = res.data.map((etel) => ({
        ...etel,
        adag_A: etel.adag_A || 0,
        adag_B: etel.adag_B || 0,
        adag_C: etel.adag_C || 0,
        leves_adag: "" // Üres, nem szerkeszthető
      }));
      setEtelek(updatedData);
    });
  }, []);

  const calculateDailyTotals = () => {
    const days = ["hétfő", "kedd", "szerda", "csütörtök", "péntek", "szombat", "vasárnap"];
  
    return days.map(day => {
      const dailyEtelek = etelek.filter(etel => etel.nev.toLowerCase().includes(day) && !etel.nev.includes("összesítés"));
  
      return {
        id: `osszesito-${day}`, // Egyedi azonosító
        nev: `${day.charAt(0).toUpperCase() + day.slice(1)} összesítés`, // Szóközzel
        
        // Az adagokat összegzi, nem összefűzi!
        adag_A: dailyEtelek.reduce((sum, etel) => sum + (parseInt(etel.adag_A) || 0), 0),
        adag_B: dailyEtelek.reduce((sum, etel) => sum + (parseInt(etel.adag_B) || 0), 0),
        adag_C: dailyEtelek.reduce((sum, etel) => sum + (parseInt(etel.adag_C) || 0), 0),
        leves_adag: "",  // Az összesítőnél nem kell leves adat
  
        email: "",
        isSummary: true // Megjelöljük, hogy összesítő sor
      };
    });
  };
  
  
  
  

  const handleEdit = (etel) => {
    if (!user) {
      console.error("Hiba: user nincs meghatározva!");
      return;
    }
  
    if (!etel) {
      console.error("Hiba: etel nincs meghatározva!");
      return;
    }
  
    if (user?.email === etel?.email || user?.isAdmin) {
      setEditingId(etel.id);
      setNewValues({ ...etel });
    } else {
      alert("Nincs jogosultságod ennek a sornak a szerkesztésére!");
    }
  };

  // Megszámolja a teljes sor értékét (ÖSSZES oszlophoz)
  const getRowTotal = (etel) => etel.adag_A + etel.adag_B + etel.adag_C;



  const handleChange = (id, field, value) => {
    setEtelek((prev) =>
      prev.map((etel) =>
        etel.id === id ? { ...etel, [field]: parseInt(value) || 0 } : etel
      )
    );

    myAxios.put(`/api/etelek/${id}`, { [field]: parseInt(value) || 0 })
      .catch((err) => console.error(err));
  };

  const handleSave = (id) => {
    myAxios
      .put(`/api/etelek/${id}`, newValues)
      .then(() => {
        setEtelek(etelek.map((etel) => (etel.id === id ? { ...etel, ...newValues } : etel)));
        setEditingId(null);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="table-container">
      <h2>Étkezési táblázat</h2>
      <table className="etel-table">
        <thead>
          <tr>
            <th>Név</th>
            <th>Főétel A</th>
            <th>Főétel B</th>
            <th>Főétel C</th>
            <th>Leves</th>
            <th>ÖSSZES</th>
            <th>Művelet</th>
          </tr>
        </thead>
        <tbody>
  {[...etelek, ...calculateDailyTotals()].map((etel, index) => (
    <tr key={index} className={etel.isSummary ? "osszesito" : ""}>
      <td><strong>{etel.nev}</strong></td> 
      
      <td>
        {etel.isSummary ? etel.adag_A : (
          <input type="number" className="input2" min="0" max="10" value={etel.adag_A || 0} 
            onChange={(e) => handleChange(etel.id, "adag_A", e.target.value)} />
        )}
      </td>
      
      <td>
        {etel.isSummary ? etel.adag_B : (
          <input type="number" className="input2" min="0" max="10" value={etel.adag_B || 0} 
            onChange={(e) => handleChange(etel.id, "adag_B", e.target.value)} />
        )}
      </td>
      
      <td>
        {etel.isSummary ? etel.adag_C : (
          <input type="number" className="input2" min="0" max="10" value={etel.adag_C || 0} 
            onChange={(e) => handleChange(etel.id, "adag_C", e.target.value)} />
        )}
      </td>
      
      <td>{etel.leves_adag || "0"}</td>
      <td>{getRowTotal(etel) || 0}</td>

      <td>
        {!etel.isSummary && (editingId === etel.id ? (
          <button onClick={() => handleSave(etel.id)}>Mentés</button>
        ) : (
          <button onClick={() => handleEdit(etel)}>Szerkesztés</button>
        ))}
      </td>
    </tr>
  ))}
</tbody>





      </table>
    </div>
  );
};

export default Etelek;
