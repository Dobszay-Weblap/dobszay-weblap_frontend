import React from 'react';
import './SimpleModal.css'; // Ha van CSS fájl hozzá, külön definiálhatod

const SimpleModal = ({ modalOpen, closeModal, foglaltsag, aktualisSzoba, ujLako, setUjLako, handleAddLako }) => {
  if (!modalOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{aktualisSzoba} Lakói</h2>
        <div>
          {foglaltsag[aktualisSzoba]?.lakok?.length > 0 ? (
            foglaltsag[aktualisSzoba].lakok.map((lako, index) => (
              <div key={index}>{lako}</div>
            ))
          ) : (
            <p>Nincsenek lakók.</p>
          )}
        </div>
        {foglaltsag[aktualisSzoba]?.tele ? (
          <p style={{ color: "red", fontWeight: "bold" }}>Ez a szoba tele van!</p>
        ) : (
          <>
            <input
              type="text"
              placeholder="Új lakó neve"
              value={ujLako}
              onChange={(e) => setUjLako(e.target.value)}
            />
            <button onClick={handleAddLako}>Hozzáadás</button>
          </>
        )}
        <button onClick={closeModal}>Bezárás</button>
      </div>
    </div>
  );
};

export default SimpleModal;
