import React, { useState, useEffect } from "react";

import "./Etelek.css"; // Stílus a kinézethez
import { myAxios } from "../contexts/MyAxios";
import { useAuth } from "../contexts/AuthContext";

const Etelek = ({ selectedDate }) => {
  const [menuk, setMenuk] = useState([]);
  const [etelek, setEtelek] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const {user} = useAuth();


useEffect(() => {
  myAxios.get("/api/menuk")
      .then((res) => {
          console.log("Menü adatok:", res.data);
          setMenuk(res.data);
      })
      .catch((err) => console.error("Menü hiba:", err));

  myAxios.get("/api/etelek")
      .then((res) => {
          console.log("Étel adatok:", res.data);
          setEtelek(res.data);
      })
      .catch((err) => console.error("Étel hiba:", err));
}, []);
useEffect(() => {
  if (!selectedDate) return;

  myAxios.get(`/api/etelek?datum=${selectedDate}`)
      .then((res) => {
          console.log(`Ételek ${selectedDate}-re:`, res.data);
          setEtelek(res.data);
      })
      .catch((err) => console.error("Étel hiba:", err));
}, [selectedDate]);


  
  const handleEdit = (etel) => {
    setEditingId(etel.id);
    setEditedData({ ...etel });
};

const handleChange = (id, field, value) => {
  setEditedData((prev) => ({
      ...prev,
      [id]: {
          ...prev[id],
          [field]: value
      }
  }));
};


const handleSave = (etel) => {
  myAxios.put(`/api/etelek/${etel.id}`, {
      ...editedData[etel.id],
      datum: selectedDate // ✅ Itt adjuk hozzá a dátumot a kéréshez
  })
  .then((res) => {
      setEtelek(etelek.map(item => item.id === etel.id ? res.data : item));
      setEditingId(null);
  })
  .catch((err) => console.error("Mentési hiba:", err));
};





  const getRowTotal = (etel) => 
    (Number(etel.adag_A) || 0) + 
    (Number(etel.adag_B) || 0) + 
    (Number(etel.adag_C) || 0);



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
    {menuk
        .filter(menu => menu.datum === selectedDate) // 🔹 Csak az adott nap menüje jelenjen meg
        .map((menu) => (
            <>
                <tr key={menu.datum} style={{ backgroundColor: "#f0f0f0", fontWeight: "bold" }}>
                    <td>{menu.datum}</td>
                    <td>{menu.foetel_A}</td>
                    <td>{menu.foetel_B}</td>
                    <td>{menu.foetel_C}</td>
                    <td>{menu.leves}</td>
                    <td></td>
                    <td></td>
                </tr>
                {etelek
                    .filter(etel => etel.datum === selectedDate) // 🔹 Csak az adott napi rendelések
                    .map((etel, index) => (
                        <tr key={index} className={etel.isSummary ? "osszesito" : ""}>
                            <td><strong>{etel.nev}</strong></td> 
                            <td>{etel.adag_A}</td>
                            <td>{etel.adag_B}</td>
                            <td>{etel.adag_C}</td>
                            <td>{etel.leves_adag || "0"}</td>
                            <td>{getRowTotal(etel) || 0}</td>
                            <td>
                                {!etel.isSummary && (editingId === etel.id ? (
                                    <button onClick={() => handleSave(etel)}>Mentés</button>
                                ) : (
                                    (user?.email === etel.email) && (
                                        <button onClick={() => handleEdit(etel)}>Szerkesztés</button>
                                    )
                                ))}
                            </td>
                        </tr>
                    ))}
            </>
        ))}
</tbody>

  </table>
</div>
  );
};

export default Etelek;
