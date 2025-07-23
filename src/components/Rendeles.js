import React, { useState, useEffect } from "react";
import "./Etelek.css";
import { myAxios } from "../contexts/MyAxios";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Etelek = () => {
  const [menuk, setMenuk] = useState([]);
  const [etelek, setEtelek] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const { user } = useAuth();

  const uniqueDates = [...new Set(etelek.map(e => e.datum))];

useEffect(() => {
  console.log("Bejelentkezett felhasználó:", user);
  console.log("Csoportjai:", user?.csoportok);
}, [user]);


  useEffect(() => {
    myAxios.get("/api/menus")
      .then((res) => setMenuk(res.data))
      .catch((err) => console.error("Menü hiba:", err));

    myAxios.get("/api/etelek")
      .then((res) => setEtelek(res.data))
      .catch((err) => console.error("Étel hiba:", err));

      myAxios.get("/api/user")
  }, []);

const canEdit = (etel) => {
  if (!user) return false;
  if (user?.jogosultsagi_szint === "admin") return true;
  if (!user?.csoportok || !etel.csoport_id) return false;
  return user.csoportok.some((csoport) => csoport.id === etel.csoport_id);
};


  const handleEdit = (etel) => {
    setEditingId(etel.id);
    setEditedData((prev) => ({
      ...prev,
      [etel.id]: etel
    }));
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
      datum: etel.datum
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
    <div className="etel-table-container">
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
          {uniqueDates.map((datum) => {
            const menu = menuk.find(m => m.datum === datum);
            const napiEtelek = etelek.filter(e => e.datum === datum);

            return (
              <React.Fragment key={datum}>
                {menu && (
                  <tr style={{ backgroundColor: "#f0f0f0", fontWeight: "bold" }}>
                    <td>{datum}</td>
                    <td>{menu.foetel_A}</td>
                    <td>{menu.foetel_B}</td>
                    <td>{menu.foetel_C}</td>
                    <td>{menu.leves}</td>
                    <td></td>
                    <td></td>
                  </tr>
                )}

                {napiEtelek.map((etel) => (
                  <tr key={etel.id}>
                    <td><strong>{etel.nev}</strong></td>
                    <td>
                      {editingId === etel.id ? (
                        <input
                          type="number"
                          value={editedData[etel.id]?.adag_A || ""}
                          onChange={(e) => handleChange(etel.id, "adag_A", e.target.value)}
                        />
                      ) : etel.adag_A}
                    </td>
                    <td>
                      {editingId === etel.id ? (
                        <input
                          type="number"
                          value={editedData[etel.id]?.adag_B || ""}
                          onChange={(e) => handleChange(etel.id, "adag_B", e.target.value)}
                        />
                      ) : etel.adag_B}
                    </td>
                    <td>
                      {editingId === etel.id ? (
                        <input
                          type="number"
                          value={editedData[etel.id]?.adag_C || ""}
                          onChange={(e) => handleChange(etel.id, "adag_C", e.target.value)}
                        />
                      ) : etel.adag_C}
                    </td>
                    <td>
                      
                    </td>
                    <td>{getRowTotal(etel)}</td>
                    <td>
                      {canEdit(etel) && (
                        editingId === etel.id ? (
                          <button onClick={() => handleSave(etel)}>Mentés</button>
                        ) : (
                          <button onClick={() => handleEdit(etel)}>Szerkesztés</button>
                        )
                      )}

                    </td>
                  </tr>
                ))}
                {/* Összesítő sor a nap végén */}
            <tr style={{ backgroundColor: "#fff176", fontWeight: "bold" }}>
              <td>{datum + " összesítés"}</td>
              <td>{napiEtelek.reduce((sum, e) => sum + (e.adag_A || 0), 0)}</td>
              <td>{napiEtelek.reduce((sum, e) => sum + (e.adag_B || 0), 0)}</td>
              <td>{napiEtelek.reduce((sum, e) => sum + (e.adag_C || 0), 0)}</td>
              <td></td>
              <td>
                {napiEtelek.reduce(
                  (sum, e) => sum + (e.adag_A || 0) + (e.adag_B || 0) + (e.adag_C || 0),
                  0
                )}
              </td>
              <td></td>
            </tr>

              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Etelek;
