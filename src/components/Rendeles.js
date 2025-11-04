import React, { useState, useEffect } from "react";
import "./Etelek.css";
import { myAxios } from "../contexts/MyAxios";
import { useAuth } from "../contexts/AuthContext";

const Etelek = () => {
  const [menuk, setMenuk] = useState([]);
  const [etelek, setEtelek] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingMenuId, setEditingMenuId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [editedMenuData, setEditedMenuData] = useState({});
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
      .then((res) => {
        console.log("Lekért ételek:", res.data);
        setEtelek(res.data);
      })
      .catch((err) => console.error("Étel hiba:", err));
  }, [user]);

  const canEdit = (etel) => {
    if (!user) return false;
    if (user?.jogosultsagi_szint === "admin") return true;
    if (!user?.csoportok || !etel.csoport_id) return false;
    return user.csoportok.some((csoport) => csoport.id === etel.csoport_id);
  };

  const isAdmin = () => {
    return user?.jogosultsagi_szint === "admin";
  };

  // Étel szerkesztés
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
        const updatedEtel = {
          ...res.data,
          adag_A: Number(res.data.adag_A) || 0,
          adag_B: Number(res.data.adag_B) || 0,
          adag_C: Number(res.data.adag_C) || 0,
        };
        
        setEtelek(etelek.map(item => item.id === etel.id ? updatedEtel : item));
        setEditingId(null);
      })
      .catch((err) => console.error("Mentési hiba:", err));
  };

  // Menü szerkesztés (csak admin)
  const handleEditMenu = (menu) => {
    setEditingMenuId(menu.id);
    setEditedMenuData((prev) => ({
      ...prev,
      [menu.id]: menu
    }));
  };

  const handleMenuChange = (id, field, value) => {
    setEditedMenuData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  const handleSaveMenu = (menu) => {
    myAxios.put(`/api/menus/${menu.id}`, editedMenuData[menu.id])
      .then((res) => {
        setMenuk(menuk.map(item => item.id === menu.id ? res.data : item));
        setEditingMenuId(null);
      })
      .catch((err) => console.error("Menü mentési hiba:", err));
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
                    <td>
                      {editingMenuId === menu.id ? (
                        <input
                          type="text"
                          value={editedMenuData[menu.id]?.foetel_A || ""}
                          onChange={(e) => handleMenuChange(menu.id, "foetel_A", e.target.value)}
                        />
                      ) : menu.foetel_A}
                    </td>
                    <td>
                      {editingMenuId === menu.id ? (
                        <input
                          type="text"
                          value={editedMenuData[menu.id]?.foetel_B || ""}
                          onChange={(e) => handleMenuChange(menu.id, "foetel_B", e.target.value)}
                        />
                      ) : menu.foetel_B}
                    </td>
                    <td>
                      {editingMenuId === menu.id ? (
                        <input
                          type="text"
                          value={editedMenuData[menu.id]?.foetel_C || ""}
                          onChange={(e) => handleMenuChange(menu.id, "foetel_C", e.target.value)}
                        />
                      ) : menu.foetel_C}
                    </td>
                    <td>
                      {editingMenuId === menu.id ? (
                        <input
                          type="text"
                          value={editedMenuData[menu.id]?.leves || ""}
                          onChange={(e) => handleMenuChange(menu.id, "leves", e.target.value)}
                        />
                      ) : menu.leves}
                    </td>
                    <td></td>
                    <td>
                      {isAdmin() && (
                        editingMenuId === menu.id ? (
                          <button onClick={() => handleSaveMenu(menu)}>Mentés</button>
                        ) : (
                          <button onClick={() => handleEditMenu(menu)}>Szerkesztés</button>
                        )
                      )}
                    </td>
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
                    <td></td>
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

                {/* Összesítő sor */}
                <tr style={{ backgroundColor: "#fff176", fontWeight: "bold" }}>
                  <td>{datum + " összesítés"}</td>
                  <td>{napiEtelek.reduce((sum, e) => sum + (Number(e.adag_A) || 0), 0)}</td>
                  <td>{napiEtelek.reduce((sum, e) => sum + (Number(e.adag_B) || 0), 0)}</td>
                  <td>{napiEtelek.reduce((sum, e) => sum + (Number(e.adag_C) || 0), 0)}</td>
                  <td></td>
                  <td>
                    {napiEtelek.reduce(
                      (sum, e) => sum + (Number(e.adag_A) || 0) + (Number(e.adag_B) || 0) + (Number(e.adag_C) || 0),
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