import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { myAxios } from "../contexts/MyAxios";

export default function PasswordChangeFirst({ show, onHide, onPasswordChanged }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async () => {
    setError("");

    // Validációk
    if (newPassword.length < 8) {
      setError("A jelszónak legalább 8 karakter hosszúnak kell lennie.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("A két jelszó nem egyezik meg.");
      return;
    }

    setLoading(true);

    try {
      await myAxios.post("/api/change-password-first", { 
        newPassword: newPassword 
      });
      
      // Sikeres jelszóváltoztatás
      setNewPassword("");
      setConfirmPassword("");
      setError("");
      
      // Értesítjük a szülő komponenst
      if (onPasswordChanged) {
        onPasswordChanged();
      }
    } catch (err) {
      console.error("Jelszóváltoztatási hiba:", err);
      setError(err.response?.data?.message || "Hiba történt a jelszó frissítésekor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
      show={show} 
      backdrop="static" 
      keyboard={false}
      centered
    >
      <Modal.Header>
        <Modal.Title>Első bejelentkezés – Jelszó megváltoztatása</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="mb-3">
          Ez az első bejelentkezésed. Biztonsági okokból kérjük, változtasd meg a jelszavadat!
        </p>
        
        <input
          type="password"
          placeholder="Új jelszó"
          className="form-control mb-2"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={loading}
        />
        
        <input
          type="password"
          placeholder="Új jelszó megerősítése"
          className="form-control mb-2"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={loading}
        />
        
        {error && <div className="alert alert-danger mt-2">{error}</div>}
        
        <small className="text-muted">
          A jelszónak legalább 8 karakterből kell állnia.
        </small>
      </Modal.Body>
      <Modal.Footer>
        <Button 
          variant="primary" 
          onClick={handlePasswordChange}
          disabled={loading || !newPassword || !confirmPassword}
        >
          {loading ? "Mentés" : "Jelszó mentése"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}