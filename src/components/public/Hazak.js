import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "./Hazak.css";
import { myAxios } from "../../contexts/MyAxios";

export default function Hazak() {
  const [foglaltsag, setFoglaltsag] = useState({});
  const [aktualisSzoba, setAktualisSzoba] = useState([]);
  const [ujLako, setUjLako] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    myAxios.get("/api/foglaltsag")
      .then((data) => {
        console.log("API válasz:", data);
        const szobaMap = {};
        data.forEach((szoba) => {
          console.log("Szoba adatok:", szoba);
          let lakok = szoba.lakok;
          if (typeof lakok === 'string') {
            try {
              lakok = JSON.parse(lakok);
            } catch (e) {
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
        console.log("Feldolgozott adatok:", szobaMap);
        setFoglaltsag(szobaMap);
      })
      .catch((err) => console.error("Hiba a foglaltság lekérésekor:", err));
  }, []);

  const getClassName = (alapClass, szobaId) => {
    const szoba = foglaltsag[szobaId];
    if (!szoba) return alapClass;
    
    return szoba.lakok.length >= szoba.max
      ? `${alapClass} foglalt`
      : alapClass;
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
    const token = localStorage.getItem('access_token');

    if (!token) {
      alert('Nincs érvényes token! Kérlek jelentkezz be!');
      return;
    }

    if (!ujLako.trim()) {
      alert('Kérlek add meg a neved!');
      return;
    }

    if (ujLako && aktualisSzoba) {
      myAxios.post("/api/foglaltsag/hozzad", {
        szoba: aktualisSzoba,
        lako: ujLako,
      })
        .then((data) => {
          const szobaMap = {};
          data.forEach((szoba) => {
            let lakok = szoba.lakok;
            if (typeof lakok === 'string') {
              try {
                lakok = JSON.parse(lakok);
              } catch (e) {
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
          setUjLako("");
          closeModal();
        })
        .catch((err) => {
          console.error("Hiba a lakó hozzáadása során:", err);
          alert(err.message || "Hiba történt a lakó hozzáadása közben");
        });
    }
  };

  const aktualisSzobaAdat = aktualisSzoba ? foglaltsag[aktualisSzoba] : null;
  const lakok = aktualisSzobaAdat?.lakok || [];
  const isFull = lakok.length >= (aktualisSzobaAdat?.max || 0);

  const Modal = ({ show, onClose, title, children, footer }) => {
  if (!show) return null;

return (
    <div style={{
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
    }} onClick={onClose}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        minWidth: '400px',
        maxWidth: '90%',
        maxHeight: '80vh',
        overflow: 'auto',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }} onClick={(e) => e.stopPropagation()}>
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '0',
            width: '30px',
            height: '30px'
          }}>×</button>
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

const Button = ({ variant = 'primary', onClick, children, ...props }) => {
  const styles = {
    primary: {
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px'
    },
    secondary: {
      backgroundColor: '#6c757d',
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px'
    }
  };

  return (
    <button onClick={onClick} style={styles[variant]} {...props}>
      {children}
    </button>
  );
};

  return (
    <div className="keret">
      <div className="foglalo-wrapper">
        <aside>
          <div className="fout">Iskola utca</div>
        </aside>

        <article className="fahazak">
          {[1, 2, 3, 4].map((szam) => {
            const szobaId1 = `F${szam}/1`;
            const szobaId2 = `F${szam}/2`;
            const szoba1 = foglaltsag[szobaId1];
            const szoba2 = foglaltsag[szobaId2];
            
            const mindkettoFoglalt = 
              szoba1 && szoba2 && 
              szoba1.lakok.length >= szoba1.max && 
              szoba2.lakok.length >= szoba2.max;

            return (
              <div
                key={`fahaz-${szam}`}
                className={`f${szam}${mindkettoFoglalt ? ' foglalt' : ''}`}
                onClick={() => openModal(szobaId1)}
              >
                Faház {szam}
              </div>
            );
          })}
        </article>

        <article className="haz">
          {[
            "Emelet 1", "Emelet 2", "Emelet 3", "Emelet 4",
            "Emelet 5", "Emelet 6", "Emelet 7", "Emelet 8",
            "Fszt 8", "Fszt 7", "Fszt 6", "Fszt 5",
            "Fszt 4", "Fszt 3", "Fszt 2", "Fszt 1"
          ].map((szoba) => {
            const osztalyNev = szoba.toLowerCase()
              .replace("emelet ", "em")
              .replace("fszt ", "fszt");
            
            return (
              <div
                key={szoba}
                className={getClassName(osztalyNev, szoba)}
                onClick={() => openModal(szoba)}
              >
                {szoba}
              </div>
            );
          })}
        </article>

        <aside>
          <div className="fout">Szigeti József utca</div>
        </aside>
      </div>

      <Modal show={modalOpen} onClose={closeModal}
        title={`${aktualisSzobaAdat?.nev || aktualisSzoba} - Lakók`}
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>
              Bezárás
            </Button>
            {!isFull && (
              <Button variant="primary" onClick={handleAddLako}>
                Hozzáadás
              </Button>
            )}
          </>
        }
      >
        <div style={{ marginBottom: '15px' }}>
          <strong>Férőhely:</strong> {lakok.length} / {aktualisSzobaAdat?.max || 0}
        </div>
        
        {lakok.length > 0 ? (
          <div style={{ marginBottom: '15px' }}>
            <strong>Jelenlegi lakók:</strong>
            <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
              {lakok.map((lako, index) => (
                <li key={index}>{lako}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p>Nincsenek lakók ebben a szobában.</p>
        )}

        {isFull && (
          <p style={{ color: "red", fontWeight: "bold" }}>
            Ez a szoba tele van!
          </p>
        )}

        {!isFull && (
          <div>
            <label htmlFor="ujLako" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Add meg a neved:
            </label>
            <input
              id="ujLako"
              type="text"
              placeholder="Írj be egy nevet..."
              value={ujLako}
              onChange={(e) => setUjLako(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
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
      </Modal>
        
    </div>
  );
};

