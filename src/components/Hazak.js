import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "./Hazak.css";
import { myAxios } from "../contexts/MyAxios";


const Hazak = () => {
  const [foglaltsag, setFoglaltsag] = useState({});
  const [aktualisSzoba, setAktualisSzoba] = useState([]);
  const [ujLako, setUjLako] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const lakokList = foglaltsag[aktualisSzoba]?.lakok || [];

// Ellenőrizd, hogy a lakók listája string formátumban van-e
let parsedLakok;
if (typeof lakokList === 'string') {
    parsedLakok = JSON.parse(lakokList); // Így szükség esetén dekódold a stringet
} else {
    parsedLakok = Array.isArray(lakokList) ? lakokList : []; // Alapértelmezetten üres tömb
}
  
  useEffect(() => {
    myAxios.get("/api/foglaltsag")
      .then((data) => {
        const szobaMap = {};
        data.forEach((szoba) => {
          szobaMap[szoba.szoba_id] = szoba;
        });
        setFoglaltsag(szobaMap);
/*         console.log(szobaMap);
 */        
      })
      .catch((err) => console.error("Hiba a foglaltság lekérésekor:", err));
  }, []);

  const getClassName = (alapClass, szobaId) =>
    foglaltsag[szobaId]?.lakok?.length >= foglaltsag[szobaId]?.max
      ? `${alapClass} foglalt`
      : alapClass;

      const openModal = (szoba) => {
        const szobaSzam = szoba.split(" ")[1]; // "Faház 1" -> "1"
        const szobaKulcsok = [`F${szobaSzam}/1`, `F${szobaSzam}/2`]; // ["F1/1", "F1/2"]
    
        // Módosítás a szoba nevének állításához
        setAktualisSzoba({ szobaKulcsok, nev: szoba });
        setModalOpen(true);
    };

      const closeModal = () => {
        setAktualisSzoba([]); // Nem null, hanem üres tömb!
        setModalOpen(false);
      };
      
      

  const handleAddLako = () => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      console.error('Nincs érvényes token!');
      return;
    }

    if (ujLako && aktualisSzoba) {
      fetch("/api/foglaltsag/hozzad", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          szoba_id: aktualisSzoba,
          lako: ujLako,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setFoglaltsag(data);
          setUjLako("");
          closeModal();
        })
        .catch((err) => {
          console.error("Hiba a lakó hozzáadása során:", err);
          alert("Hiba történt a lakó hozzáadása közben");
        });
    }
  };

  return (
    <div className="keret">
      <div className="foglalo-wrapper">
        <aside>
          <div className="fout">Iskola utca</div>
        </aside>

        <article className="fahazak">
  {["Faház 1", "Faház 2", "Faház 3", "Faház 4"].map((szoba) => {
    const szobaSzam = szoba.split(" ")[1]; // Második szó (1, 2, 3, 4)

    return (
      <div
        key={szoba}
        className={`f${szobaSzam}`} // Pl.: f1, f2, f3, f4
        onClick={() => openModal(szoba)}
      >
        {szoba}
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

      <Modal show={modalOpen} onHide={closeModal}>
  <Modal.Header closeButton>
  <Modal.Title>{aktualisSzoba.nev} Lakói</Modal.Title>
  </Modal.Header>
  <Modal.Body>
  {parsedLakok.length > 0 ? (
    parsedLakok.map((lako, index) => <div key={index}>{lako}</div>)
) : (
    <p>Nincsenek lakók.</p>
)}

    {parsedLakok.length >= foglaltsag[aktualisSzoba[0]]?.max && (
      <p style={{ color: "red", fontWeight: "bold" }}>Ez a faház tele van!</p>
    )}

    <input
      type="text"
      placeholder="Új lakó neve"
      value={ujLako}
      onChange={(e) => setUjLako(e.target.value)}
    />
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={closeModal}>Bezárás</Button>
    {!foglaltsag[aktualisSzoba[0]]?.foglalt && (
      <Button variant="primary" onClick={handleAddLako}>Hozzáadás</Button>
    )}
  </Modal.Footer>
</Modal>

    </div>
  );
};

export default Hazak;