import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";

export default function PasswordChangeFirst({ user }) {
  const [show, setShow] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user && !user.password_changed) {
      setShow(true);
    }
  }, [user]);

  const handlePasswordChange = async () => {
    if (newPassword.length < 8) {
      setError("A jelszónak legalább 8 karakter hosszúnak kell lennie.");
      return;
    }

    try {
      await axios.post("/api/change-password", { newPassword });
      setShow(false);
      window.location.reload(); // újratölti, hogy frissüljön az állapot
    } catch (err) {
      setError("Hiba történt a jelszó frissítésekor.");
      console.error(err);
    }
  };

  return (
    <Modal show={show} backdrop="static" keyboard={false}>
      <Modal.Header>
        <Modal.Title>Első bejelentkezés – jelszó megváltoztatása</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input
          type="password"
          placeholder="Új jelszó"
          className="form-control mb-2"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        {error && <div className="text-danger">{error}</div>}
        <small className="text-muted">A jelszónak legalább 8 karakterből kell állnia.</small>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handlePasswordChange}>
          Mentés
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
