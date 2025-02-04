import React, { useEffect, useState } from "react";
import "./Hazak.css";

const Hazak = () => {
  const [foglaltsag, setFoglaltsag] = useState({});
  const [aktualisSzoba, setAktualisSzoba] = useState(null);
  const [ujLako, setUjLako] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  // Lekérjük a foglaltsági adatokat a backendről
  useEffect(() => {
    fetch("/api/foglaltsag") // Az API endpoint a backendhez
      .then((res) => res.json())
      .then((data) => setFoglaltsag(data))
      .catch((err) => console.error("Hiba a foglaltság lekérésekor:", err));
  }, []);

  const getClassName = (alapClass, szobaNev) =>
    foglaltsag[szobaNev] ? `${alapClass} foglalt` : alapClass;

  const renderTooltip = (szobaNev) => {
    return foglaltsag[szobaNev] ? (
      <div className="tooltip">Tele van</div>
    ) : null;
  };

  // Modal megnyitása és bezárása
  const openModal = (szoba) => {
    setAktualisSzoba(szoba);
    setModalOpen(true);
  };

  const closeModal = () => {
    setAktualisSzoba(null);
    setModalOpen(false);
  };

  // Lakó hozzáadása
  const handleAddLako = () => {
    if (ujLako && aktualisSzoba) {
      fetch("/api/foglaltsag/hozzad", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          szoba: aktualisSzoba,
          lako: ujLako,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setFoglaltsag(data);
          setUjLako(""); // Ürítjük a lakó nevét
          closeModal(); // Bezárjuk a modal-t
        })
        .catch((err) => console.error("Hiba a lakó hozzáadása során:", err));
    }
  };

  return (
    <div className="keret">
      <div className="foglalo-wrapper">
        {/* Iskola utca blokk */}
        <aside>
          <div className="fout">Iskola utca</div>
        </aside>

        {/* Faházak blokk */}
        <article className="fahazak">
          <div className="f1-container">
          <div
              className={getClassName("f1", "Faház 1")}
              onClick={() => openModal("Faház 1")}
            >
              1. Faház
              {renderTooltip("Faház 1")}
            </div>
          </div>
          <div className="f2-container">
            <div
              className={getClassName("f2", "Faház 2")}
              onClick={() => openModal("Faház 2")}
            >
              2. Faház
              {renderTooltip("Faház 2")}
            </div>
          </div>
          <div className="f3-container">
            <div
              className={getClassName("f3", "Faház 3")}
              onClick={() => openModal("Faház 3")}
            >
              3. Faház
              {renderTooltip("Faház 3")}
            </div>
          </div>
          <div className="f4-container">
            <div
              className={getClassName("f4", "Faház 4")}
              onClick={() => openModal("Faház 4")}
            >
              4. Faház
              {renderTooltip("Faház 4")}
            </div>
          </div>
        </article>

        {/* Emeletek blokk */}
        <article className="haz">
          <div className={getClassName("em1", "Emelet 1")}>Emelet 1</div>
          <div className={getClassName("em2", "Emelet 2")}>Emelet 2</div>
          <div className={getClassName("em3", "Emelet 3")}>Emelet 3</div>
          <div className={getClassName("em4", "Emelet 4")}>Emelet 4</div>
          <div className={getClassName("em5", "Emelet 5")}>Emelet 5</div>
          <div className={getClassName("em6", "Emelet 6")}>Emelet 6</div>
          <div className={getClassName("em7", "Emelet 7")}>Emelet 7</div>
          <div className={getClassName("em8", "Emelet 8")}>Emelet 8</div>
          <div className={getClassName("fszt8", "Fszt 8")}>Fszt 8.</div>
          <div className={getClassName("fszt7", "Fszt 7")}>Fszt 7.</div>
          <div className={getClassName("fszt6", "Fszt 6")}>Fszt 6.</div>
          <div className={getClassName("fszt5", "Fszt 5")}>Fszt 5.</div>
          <div className={getClassName("fszt4", "Fszt 4")}>Fszt 4.</div>
          <div className={getClassName("fszt3", "Fszt 3")}>Fszt 3.</div>
          <div className={getClassName("fszt2", "Fszt 2")}>Fszt 2.</div>
          <div className={getClassName("fszt1", "Fszt 1")}>Fszt 1.</div>
        </article>

        {/* Szigeti József utca blokk */}
        <aside>
          <div className="fout">Szigeti József utca</div>
        </aside>
      </div>

      {modalOpen && (
  <div className="modal">
    <div className="modal-content">
      <h2>{aktualisSzoba} Lakói</h2>
      <div>
        {/* Kiíratjuk a lakókat */}
        {foglaltsag[aktualisSzoba] &&
          foglaltsag[aktualisSzoba].lakok?.map((lako, index) => (
            <div key={index}>{lako}</div>
          ))}
      </div>
      <input
        type="text"
        placeholder="Új lakó neve"
        value={ujLako}
        onChange={(e) => setUjLako(e.target.value)}
      />
      <button onClick={handleAddLako}>Hozzáadás</button>
      <button onClick={closeModal}>Bezárás</button>
    </div>
  </div>
)}

    </div>
  );
};

export default Hazak;
