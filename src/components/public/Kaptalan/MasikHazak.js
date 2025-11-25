import { useEffect, useState } from "react";
import "./Hazak.css";
import { myAxios } from "../../../contexts/MyAxios";
import { useAuth } from "../../../contexts/AuthContext";

const CustomModal = ({ show, onClose, title, children, footer }) => {
    if (!show) return null;

    return (
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} 
        onClick={onClose}
      >
        <div 
          style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            minWidth: '400px',
            maxWidth: '90%',
            maxHeight: '80vh',
            overflow: 'auto',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }} 
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{
            padding: '20px',
            borderBottom: '1px solid #e0e0e0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3 style={{ margin: 0 }}>{title}</h3>
            <button 
              onClick={onClose} 
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                padding: '0',
                width: '30px',
                height: '30px'
              }}
            >
              ×
            </button>
          </div>
          <div style={{ padding: '20px' }}>
            {children}
          </div>
          {footer && (
            <div style={{
              padding: '15px 20px',
              borderTop: '1px solid #e0e0e0',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px'
            }}>
              {footer}
            </div>
          )}
        </div>
      </div>
    );
};

export default function MasikHazak() {
  const [foglaltsag, setFoglaltsag] = useState({});
  const [aktualisSzoba, setAktualisSzoba] = useState(null);
  const [ujLako, setUjLako] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    fetchFoglaltsag();
  }, []);

  const isAdmin = () => {
    return user?.jogosultsagi_szint === "admin";
  };

  const fetchFoglaltsag = () => {
    myAxios.get("/api/foglaltsag")
      .then((response) => {
        const data = Array.isArray(response) ? response : response.data;
        
        if (!Array.isArray(data)) {
          console.error("A válasz nem tömb:", data);
          return;
        }

        const szobaMap = {};
        data.forEach((szoba) => {
          let lakok = szoba.lakok;
          
          if (typeof lakok === 'string') {
            try {
              lakok = JSON.parse(lakok);
            } catch (e) {
              console.error("JSON parse hiba:", e);
              lakok = [];
            }
          }
          
          if (!Array.isArray(lakok)) {
            lakok = [];
          }
          
          szobaMap[szoba.szoba_id] = {
            ...szoba,
            lakok: lakok
          };
        });
        
        setFoglaltsag(szobaMap);
      })
      .catch((err) => {
        console.error("Hiba a foglaltság lekérésekor:", err);
      });
  };

  const getClassName = (szobaId) => {
    const szoba = foglaltsag[szobaId];
    if (!szoba) return 'nagy-szoba';
    
    return szoba.lakok.length >= szoba.max
      ? 'nagy-szoba foglalt'
      : 'nagy-szoba';
  };

  const openModal = (szobaId) => {
    setAktualisSzoba(szobaId);
    setModalOpen(true);
  };

  const closeModal = () => {
    setAktualisSzoba(null);
    setUjLako("");
    setModalOpen(false);
  };

  const handleAddLako = () => {
    const token = localStorage.getItem('auth_token');

    if (!token) {
      alert('Nincs érvényes token! Kérlek jelentkezz be!');
      return;
    }

    if (!ujLako.trim()) {
      alert('Kérlek add meg a neved!');
      return;
    }

    if (!aktualisSzoba) {
      alert('Nincs kiválasztva szoba!');
      return;
    }

    myAxios.post("/api/foglaltsag/hozzad", {
      szoba: aktualisSzoba,
      lako: ujLako.trim(),
    }, {
      headers: {
        "Authorization": `Bearer ${token}`,
      }
    })
      .then(() => {
        fetchFoglaltsag();
        closeModal();
      })
      .catch((err) => {
        console.error("Hiba a lakó hozzáadása során:", err);
        const errorMsg = err.response?.data?.error || err.message || "Hiba történt a lakó hozzáadása közben";
        alert(errorMsg);
      });
  };

  const handleDeleteAll = () => {
    if (!window.confirm("Biztosan törölni szeretnéd az összes lakót?")) return;

    const token = localStorage.getItem('auth_token');

    if (!token) return alert('Nincs érvényes token!');

    setIsDeleting(true);
    
    myAxios.delete("/api/foglaltsag/osszes", {
      headers: {
        Authorization: `Bearer ${token}`
      },
    })
    .then(() => {
      fetchFoglaltsag();
    })
    .catch((err) => {
      console.error(err);
      alert(err.response?.data?.error || "Hiba történt a törlés közben");
    })
    .finally(() => setIsDeleting(false));
  };

  const handleDeleteLako = (szobaId, lakoNev) => {
    const token = localStorage.getItem('auth_token');
    
    if (!window.confirm('Biztosan törölni szeretnéd?')) return;

    const szoba = foglaltsag[szobaId];
    if (!szoba) {
      console.error('Szoba nem található:', szobaId);
      return;
    }
    
    const lakoIndex = szoba.lakok.findIndex(l => l === lakoNev);
    if (lakoIndex === -1) {
      console.error('Lakó nem található:', lakoNev);
      return;
    }

    myAxios.delete(`/api/foglaltsag/torol`, {
      params: {
        roomId: szobaId,
        index: lakoIndex
      },
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      fetchFoglaltsag();
    })
    .catch(err => {
      console.error('Törlési hiba:', err);
      const msg = err.response?.data?.error || err.response?.data?.message || 'Hiba a törlés során';
      alert(msg);
    });
  };

  const aktualisSzobaAdat = aktualisSzoba ? foglaltsag[aktualisSzoba] : null;
  const lakok = aktualisSzobaAdat?.lakok || [];
  const max = aktualisSzobaAdat?.max || 0;
  const isFull = lakok.length >= max;

  const CustomButton = ({ variant = 'primary', onClick, children, disabled, style }) => {
    const styles = {
      primary: {
        backgroundColor: disabled ? '#ccc' : '#007bff',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '4px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: '14px',
        ...style
      },
      secondary: {
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        ...style
      },
      danger: {
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        ...style
      }
    };

    return (
      <button 
        onClick={onClick} 
        style={styles[variant] || styles.primary} 
        disabled={disabled}
      >
        {children}
      </button>
    );
  };

  return (
    <div className="masik-keret">
      <h2>Másik Ház</h2>
      {isAdmin() && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 999,
            backgroundColor: 'rgba(220, 53, 69, 0.9)',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <CustomButton
            variant="danger"
            onClick={handleDeleteAll}
            disabled={isDeleting}
            style={{
              backgroundColor: '#fff',
              color: '#dc3545',
              border: '2px solid #fff',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out'
            }}
          >
            🗑️ Összes lakó törlése
          </CustomButton>
        </div>
      )}

      <div className="masik-haz-container">
        <div 
          className={getClassName('Bal')}
          onClick={() => openModal('Bal')}
        >
          <div className="szoba-cim">Bal oldal</div>
        </div>
        <div 
          className={getClassName('Kozep')}
          onClick={() => openModal('Kozep')}
        >
          <div className="szoba-cim">Közép</div>
        </div>

        <div 
          className={getClassName('Jobb')}
          onClick={() => openModal('Jobb')}
        >
          <div className="szoba-cim">Jobb oldal</div>
        </div>
      </div>

      <CustomModal 
        show={modalOpen} 
        onClose={closeModal}
        title={`${aktualisSzobaAdat?.nev || aktualisSzoba} (${lakok.length}/${max})`}
        footer={
          <>
            <CustomButton variant="secondary" onClick={closeModal}>
              Bezárás
            </CustomButton>
            {!isFull && (
              <CustomButton 
                variant="primary" 
                onClick={handleAddLako}
                disabled={!ujLako.trim()}
              >
                Hozzáadás
              </CustomButton>
            )}
          </>
        }
      >
        {lakok.length > 0 ? (
          <div style={{ marginBottom: '15px' }}>
            <strong>Jelenlegi lakók:</strong>
            <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
              {lakok.map((lako, index) => (
                <li 
                  key={index} 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '6px'
                  }}
                >
                  <div>{lako}</div>
                  <button
                    onClick={() => handleDeleteLako(aktualisSzoba, lako)}
                    style={{
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '2px 6px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    ❌
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p style={{ fontStyle: 'italic', color: '#666' }}>
            Még nincs lakó ebben a szobában.
          </p>
        )}

        {isFull ? (
          <div style={{ 
            color: "red", 
            fontWeight: "bold",
            padding: '10px',
            backgroundColor: '#ffe6e6',
            borderRadius: '5px',
            textAlign: 'center'
          }}>
            Ez a szoba tele van!
          </div>
        ) : (
          <div>
            <label 
              htmlFor="ujLako" 
              style={{ 
                display: 'block', 
                marginBottom: '5px', 
                fontWeight: 'bold' 
              }}
            >
              Add meg a neved:
            </label>
            <input
              id="ujLako"
              type="text"
              placeholder="Írj be egy nevet..."
              value={ujLako}
              onChange={(e) => setUjLako(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && ujLako.trim()) {
                  handleAddLako();
                }
              }}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
        )}
      </CustomModal>
    </div>
  );
}