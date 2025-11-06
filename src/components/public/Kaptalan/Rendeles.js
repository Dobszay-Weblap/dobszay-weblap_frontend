import React, { useState, useEffect } from "react";
import "./Etelek.css";
import { myAxios } from "../../../contexts/MyAxios";
import { useAuth } from "../../../contexts/AuthContext";

const Etelek = () => {
  const [menuk, setMenuk] = useState([]);
  const [etelek, setEtelek] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingMenuId, setEditingMenuId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [editedMenuData, setEditedMenuData] = useState({});
  const [kezdoDatum, setKezdoDatum] = useState("");
  const [ujDatum, setUjDatum] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  // Generálunk 7 napot a kezdő dátumból
  const datumok = kezdoDatum
    ? Array.from({ length: 7 }, (_, i) => {
        const d = new Date(kezdoDatum);
        d.setDate(d.getDate() + i);
        return d.toISOString().split("T")[0];
      })
    : [];

  // Kezdő dátum betöltése
  const betoltDatum = () => {
    myAxios.get('/api/kezdo-datum')
      .then((res) => {
        setKezdoDatum(res.data.kezdoDatum);
      })
      .catch((err) => console.error("Dátum betöltési hiba:", err));
  };

  // Összes adat betöltése
  const betoltOsszesMenukEsEteleket = () => {
    setLoading(true);
    Promise.all([
      myAxios.get("/api/menus"),
      myAxios.get("/api/etelek")
    ])
      .then(([menukRes, etelekRes]) => {
        setMenuk(menukRes.data);
        setEtelek(etelekRes.data);
      })
      .catch((err) => console.error("Betöltési hiba:", err))
      .finally(() => setLoading(false));
  };

  // Kezdeti betöltés
  useEffect(() => {
    betoltDatum();
  }, []);

  useEffect(() => {
    if (kezdoDatum) {
      betoltOsszesMenukEsEteleket();
    }
  }, [kezdoDatum]);

  const canEdit = (etel) => {
    if (!user) return false;
    if (user?.jogosultsagi_szint === "admin") return true;
    if (!user?.csoportok || !etel.csoport_id) return false;
    return user.csoportok.some((csoport) => csoport.id === etel.csoport_id);
  };

  const isAdmin = () => {
    return user?.jogosultsagi_szint === "admin";
  };

  // Ellenőrzi, hogy hány főétel van kitöltve
  const getActiveMenuItems = (menu) => {
    if (!menu) return [];
    const items = [];
    if (menu.foetel_A && menu.foetel_A.trim() !== '') items.push({ key: 'A', label: menu.foetel_A });
    if (menu.foetel_B && menu.foetel_B.trim() !== '') items.push({ key: 'B', label: menu.foetel_B });
    if (menu.foetel_C && menu.foetel_C.trim() !== '') items.push({ key: 'C', label: menu.foetel_C });
    return items;
  };

  // Kezdő dátum mentése
  const handleDatumMentes = () => {
    if (!ujDatum) {
      return;
    }

    setLoading(true);
    myAxios.post("/api/kezdo-datum", { datum: ujDatum })
      .then(() => {
        setUjDatum("");
        betoltDatum(); // Ez automatikusan újratölti a menüket és ételeket is
      })
      .catch((err) => {
        alert("Hiba: " + (err.response?.data?.error || err.message));
      })
      .finally(() => setLoading(false));
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

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Betöltés...</div>;
  }

  return (
    <div className="etel-table-container">
      <h2>Étkezési táblázat</h2>      
      {isAdmin() && (
        <div style={{ marginBottom: "20px", padding: "15px", backgroundColor: "#f9f9f9" }}>
          <h3>Hét kezdő dátumának beállítása</h3>
          <p><strong>Aktuális kezdő dátum:</strong> {kezdoDatum || "nincs beállítva"}</p>
          <div style={{ marginTop: "10px" }}>
            <input
              type="date"
              value={ujDatum}
              onChange={(e) => setUjDatum(e.target.value)}
              style={{ padding: "8px", marginRight: "10px", fontSize: "14px" }}
            />
            <button 
              onClick={handleDatumMentes}
              style={{ padding: "8px 16px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
            >
              Mentés
            </button>
          </div>
        </div>
      )}

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
          {datumok.map((datum) => {
            const menu = menuk.find(m => m.datum === datum);
            const napiEtelek = etelek.filter(e => e.datum === datum);
            const activeItems = getActiveMenuItems(menu);

            return (
              <React.Fragment key={datum}>
                {menu && (
                  <tr style={{ backgroundColor: "#ebc182ff", fontWeight: "bold" }}>
                    <td>{datum}</td>
                    
                    {/* Dinamikus menü oszlopok */}
                    {activeItems.length === 0 ? (
                      <td colSpan="3" style={{ textAlign: 'center' }}>Nincs menü</td>
                    ) : activeItems.length === 1 && editingMenuId !== menu.id ? (
                      <td colSpan="3" style={{ textAlign: 'center' }}>
                        {activeItems[0].label}
                      </td>
                    ) : activeItems.length === 2 && editingMenuId !== menu.id ? (
                      <>
                        {activeItems.map((item) => (
                          <td key={item.key}>{item.label}</td>
                        ))}
                        <td></td>
                      </>
                    ) : (
                      <>
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
                      </>
                    )}
                    
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
                    
                    {activeItems.length === 0 ? (
                      <td colSpan="3" style={{ textAlign: 'center' }}>-</td>
                    ) : activeItems.length === 1 ? (
                      <td colSpan="3" style={{ textAlign: 'center' }}>
                        {editingId === etel.id ? (
                          <input
                            type="number"
                            value={editedData[etel.id]?.[`adag_${activeItems[0].key}`] || ""}
                            onChange={(e) => handleChange(etel.id, `adag_${activeItems[0].key}`, e.target.value)}
                          />
                        ) : etel[`adag_${activeItems[0].key}`] || 0}
                      </td>
                    ) : activeItems.length === 2 ? (
                      <>
                        {activeItems.map((item) => (
                          <td key={item.key}>
                            {editingId === etel.id ? (
                              <input
                                type="number"
                                value={editedData[etel.id]?.[`adag_${item.key}`] || ""}
                                onChange={(e) => handleChange(etel.id, `adag_${item.key}`, e.target.value)}
                              />
                            ) : etel[`adag_${item.key}`] || 0}
                          </td>
                        ))}
                        <td></td>
                      </>
                    ) : (
                      <>
                        <td>
                          {editingId === etel.id ? (
                            <input
                              type="number"
                              value={editedData[etel.id]?.adag_A || ""}
                              onChange={(e) => handleChange(etel.id, "adag_A", e.target.value)}
                            />
                          ) : etel.adag_A || 0}
                        </td>
                        <td>
                          {editingId === etel.id ? (
                            <input
                              type="number"
                              value={editedData[etel.id]?.adag_B || ""}
                              onChange={(e) => handleChange(etel.id, "adag_B", e.target.value)}
                            />
                          ) : etel.adag_B || 0}
                        </td>
                        <td>
                          {editingId === etel.id ? (
                            <input
                              type="number"
                              value={editedData[etel.id]?.adag_C || ""}
                              onChange={(e) => handleChange(etel.id, "adag_C", e.target.value)}
                            />
                          ) : etel.adag_C || 0}
                        </td>
                      </>
                    )}
                    
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
                <tr style={{ backgroundColor: "#76ff86ff", fontWeight: "bold" }}>
                  <td>{datum + " összesítés"}</td>
                  
                  {activeItems.length === 0 ? (
                    <td colSpan="3" style={{ textAlign: 'center' }}>-</td>
                  ) : activeItems.length === 1 ? (
                    <td colSpan="3" style={{ textAlign: 'center' }}>
                      {napiEtelek.reduce((sum, e) => sum + (Number(e[`adag_${activeItems[0].key}`]) || 0), 0)}
                    </td>
                  ) : activeItems.length === 2 ? (
                    <>
                      {activeItems.map((item) => (
                        <td key={item.key}>
                          {napiEtelek.reduce((sum, e) => sum + (Number(e[`adag_${item.key}`]) || 0), 0)}
                        </td>
                      ))}
                      <td></td>
                    </>
                  ) : (
                    <>
                      <td>{napiEtelek.reduce((sum, e) => sum + (Number(e.adag_A) || 0), 0)}</td>
                      <td>{napiEtelek.reduce((sum, e) => sum + (Number(e.adag_B) || 0), 0)}</td>
                      <td>{napiEtelek.reduce((sum, e) => sum + (Number(e.adag_C) || 0), 0)}</td>
                    </>
                  )}
                  
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