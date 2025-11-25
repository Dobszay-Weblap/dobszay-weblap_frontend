import React, { useState, useEffect } from "react";
import "./Etelek.css";
import { myAxios } from "../../../contexts/MyAxios";
import { useAuth } from "../../../contexts/AuthContext";

const Etelek = () => {
  const [menuk, setMenuk] = useState([]);
  const [etelek, setEtelek] = useState([]);
  const [csoportok, setCsoportok] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingMenuId, setEditingMenuId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [editedMenuData, setEditedMenuData] = useState({});
  const [kezdoDatum, setKezdoDatum] = useState("");
  const [ujDatum, setUjDatum] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSorrendModal, setShowSorrendModal] = useState(false);

  const { user } = useAuth();

  const datumok = kezdoDatum
    ? Array.from({ length: 7 }, (_, i) => {
        const d = new Date(kezdoDatum);
        d.setDate(d.getDate() + i);
        return d.toISOString().split("T")[0];
      })
    : [];

  const betoltDatum = () => {
    myAxios.get('/api/kezdo-datum')
      .then((res) => {
        setKezdoDatum(res.data.kezdoDatum);
      })
      .catch((err) => console.error("Dátum betöltési hiba:", err));
  };

  const betoltCsoportok = () => {
    myAxios.get('/api/csoportok')
      .then((res) => {
        setCsoportok(res.data.sort((a, b) => (a.sorrend || 0) - (b.sorrend || 0)));
      })
      .catch((err) => console.error("Csoportok betöltési hiba:", err));
  };

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

  useEffect(() => {
    betoltDatum();
    betoltCsoportok();
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

  const getActiveMenuItems = (menu) => {
    if (!menu) return [];
    const items = [];
    if (menu.foetel_A && menu.foetel_A.trim() !== '') items.push({ key: 'A', label: menu.foetel_A });
    if (menu.foetel_B && menu.foetel_B.trim() !== '') items.push({ key: 'B', label: menu.foetel_B });
    if (menu.foetel_C && menu.foetel_C.trim() !== '') items.push({ key: 'C', label: menu.foetel_C });
    return items;
  };

  const handleDatumMentes = () => {
    if (!ujDatum) {
      return;
    }

    setLoading(true);
    myAxios.post("/api/kezdo-datum", { datum: ujDatum })
      .then(() => {
        setUjDatum("");
        betoltDatum();
      })
      .catch((err) => {
        alert("Hiba: " + (err.response?.data?.error || err.message));
      })
      .finally(() => setLoading(false));
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

  // ✨ Csoport sorrend kezelés
  const moveCsoportUp = (index) => {
    if (index === 0) return;
    const newCsoportok = [...csoportok];
    [newCsoportok[index - 1], newCsoportok[index]] = [newCsoportok[index], newCsoportok[index - 1]];
    setCsoportok(newCsoportok);
  };

  const moveCsoportDown = (index) => {
    if (index === csoportok.length - 1) return;
    const newCsoportok = [...csoportok];
    [newCsoportok[index], newCsoportok[index + 1]] = [newCsoportok[index + 1], newCsoportok[index]];
    setCsoportok(newCsoportok);
  };

  const saveCsoportSorrend = () => {
    const csoportokWithSorrend = csoportok.map((csoport, index) => ({
      id: csoport.id,
      sorrend: index + 1
    }));

    myAxios.put('/api/csoportok/sorrend', {
      csoportok: csoportokWithSorrend
    })
      .then(() => {
        setShowSorrendModal(false);
        //alert('✅ Sorrend sikeresen mentve!');
        betoltCsoportok();
        betoltOsszesMenukEsEteleket();
      })
      .catch((err) => {
        console.error('Hiba a sorrend mentésekor:', err);
        alert('Nem sikerült menteni a sorrendet.');
      });
  };

  // Csoportosított és rendezett ételek lekérése egy adott dátumra
  const getRendezettEtelek = (datum) => {
    const napiEtelek = etelek.filter(e => e.datum === datum);
    
    return napiEtelek.sort((a, b) => {
      const aCsoport = csoportok.find(c => c.id === a.csoport_id);
      const bCsoport = csoportok.find(c => c.id === b.csoport_id);
      
      const aSorrend = aCsoport?.sorrend || 999;
      const bSorrend = bCsoport?.sorrend || 999;
      
      return aSorrend - bSorrend;
    });
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
          <h3>Admin beállítások</h3>
          
          <div style={{ marginBottom: "15px" }}>
            <button
              onClick={() => setShowSorrendModal(true)}
              style={{
                padding: "10px 20px",
                backgroundColor: "#2196F3",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginRight: "10px"
              }}
            >
              ⬍⬍ Nevek sorrendje
            </button>
          </div>

          <div>
            <h4>Hét kezdő dátumának beállítása</h4>
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
        </div>
      )}

      {/* ✨ Sorrend Modal */}
      {showSorrendModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h3>📋 Nevek sorrendjének beállítása</h3>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
              Használd a ▲▼ gombokat a nevek átrendezéséhez a táblázatban.
            </p>

            <div style={{ marginBottom: '20px' }}>
              {csoportok
                .filter(c => c.nev.trim().toLowerCase() !== 'virág étterem')
                .map((csoport, index) => (
                  <div
                    key={csoport.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px',
                      marginBottom: '8px',
                      backgroundColor: '#f5f5f5',
                      borderRadius: '4px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        backgroundColor: '#666',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        minWidth: '30px',
                        textAlign: 'center',
                        fontSize: '14px'
                      }}>
                        {index + 1}.
                      </span>
                      <strong>{csoport.nev}</strong>
                    </div>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button
                        onClick={() => moveCsoportUp(csoportok.findIndex(c => c.id === csoport.id))}
                        disabled={index === 0}
                        style={{
                          padding: '5px 10px',
                          border: '1px solid #ccc',
                          backgroundColor: index === 0 ? '#e0e0e0' : 'white',
                          cursor: index === 0 ? 'not-allowed' : 'pointer',
                          borderRadius: '4px'
                        }}
                        title="Fel"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => moveCsoportDown(csoportok.findIndex(c => c.id === csoport.id))}
                        disabled={index === csoportok.filter(c => c.nev.trim().toLowerCase() !== 'virág étterem').length - 1}
                        style={{
                          padding: '5px 10px',
                          border: '1px solid #ccc',
                          backgroundColor: index === csoportok.filter(c => c.nev.trim().toLowerCase() !== 'virág étterem').length - 1 ? '#e0e0e0' : 'white',
                          cursor: index === csoportok.filter(c => c.nev.trim().toLowerCase() !== 'virág étterem').length - 1 ? 'not-allowed' : 'pointer',
                          borderRadius: '4px'
                        }}
                        title="Le"
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowSorrendModal(false);
                  betoltCsoportok();
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#9e9e9e',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Mégse
              </button>
              <button
                onClick={saveCsoportSorrend}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                💾 Mentés
              </button>
            </div>
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
            const napiEtelek = getRendezettEtelek(datum); // ✨ Használjuk a rendezett listát
            const activeItems = getActiveMenuItems(menu);

            return (
              <React.Fragment key={datum}>
                {menu && (
                  <tr style={{ backgroundColor: "#ebc182ff", fontWeight: "bold" }}>
                    <td>{datum}</td>
                    
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