import React, { useEffect, useState } from 'react';
import "./Szabolyok.css";
import { Button, Modal, Form } from 'react-bootstrap';
import { myAxios } from '../../../contexts/MyAxios';

export default function Szabalyok() {
  const [szabalyok, setSzabalyok] = useState(null);
  const [szerkesztMod, setSzerkesztMod] = useState(false);
  const [aktualis, setAktualis] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    myAxios.get('/api/szabalyok')
      .then(res => {
        setSzabalyok(res.data);
        setAktualis(res.data); // szerkesztéshez másolat
      })
      .catch(err => console.error("Hiba a szabályok lekérésekor:", err));
  }, []);

  const handleChange = (e) => {
    setAktualis({ ...aktualis, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    myAxios.put(`/api/szabalyok/${szabalyok.id}`, aktualis)
      .then(res => {
        setSzabalyok(res.data);
        setShowModal(false);
        setSzerkesztMod(false);
      })
      .catch(err => console.error("Mentési hiba:", err));
  };

  if (!szabalyok) return <p>Betöltés...</p>;

  return (
    <div style={{ padding: '2rem',backgroundColor:'lightsalmon', borderRadius:'15px'}}>
      <h2 className='info'>Információk</h2>
      <p className='cim'><strong >Felső cím:</strong> {szabalyok.felso_cim}</p>
      <p className='cim'><strong>Alsó cím:</strong> {szabalyok.also_cim}</p>
      <p className='cim'><strong>Gondnok:</strong> {szabalyok.gondnok_nev}  ???</p>
      <p className='cim'><strong>Wifi:</strong> {szabalyok.wifi_nev} (jelszó: {szabalyok.wifi_jelszo})</p>

      <h3 className='info'style={{ marginTop: '2rem' }}>Csendes pihenő</h3>
      <p className='cim' style={{ whiteSpace: 'pre-line' }}>{szabalyok.csendes_piheno}</p>

      <h3 className='info' style={{ marginTop: '1.5rem' }}>Malacszolgálat</h3>
      <p className='cim' style={{ whiteSpace: 'pre-line' }}>{szabalyok.malacszolgalat}</p>

      <div style={{ marginTop: "2rem" }}>
        <Button variant="warning" onClick={() => setShowModal(true)}>Szerkesztés</Button>
      </div>

      {/* Szerkesztő Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
  <Modal.Header closeButton>
    <Modal.Title>Szabály szerkesztése</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <div className="container-fluid">
        <div className="row g-3">
          <div className="col-md-6">
            <Form.Group>
              <Form.Label>Felső cím</Form.Label>
              <Form.Control name="felso_cim" value={aktualis?.felso_cim} onChange={handleChange} />
            </Form.Group>
          </div>

          <div className="col-md-6">
            <Form.Group>
              <Form.Label>Alsó cím</Form.Label>
              <Form.Control name="also_cim" value={aktualis?.also_cim} onChange={handleChange} />
            </Form.Group>
          </div>

          <div className="col-md-6">
            <Form.Group>
              <Form.Label>Gondnok neve</Form.Label>
              <Form.Control name="gondnok_nev" value={aktualis?.gondnok_nev} onChange={handleChange} />
            </Form.Group>
          </div>

          <div className="col-md-6">
            <Form.Group>
              <Form.Label>Wifi név</Form.Label>
              <Form.Control name="wifi_nev" value={aktualis?.wifi_nev} onChange={handleChange} />
            </Form.Group>
          </div>

          <div className="col-md-6">
            <Form.Group>
              <Form.Label>Wifi jelszó</Form.Label>
              <Form.Control name="wifi_jelszo" value={aktualis?.wifi_jelszo} onChange={handleChange} />
            </Form.Group>
          </div>

          <div className="col-12">
            <Form.Group>
              <Form.Label>Csendes pihenő</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="csendes_piheno"
                value={aktualis?.csendes_piheno}
                onChange={handleChange}
              />
            </Form.Group>
          </div>

          <div className="col-12">
            <Form.Group>
              <Form.Label>Malacszolgálat</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="malacszolgalat"
                value={aktualis?.malacszolgalat}
                onChange={handleChange}
              />
            </Form.Group>
          </div>
        </div>
      </div>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowModal(false)}>
      Mégse
    </Button>
    <Button variant="primary" onClick={handleSubmit}>
      Mentés
    </Button>
  </Modal.Footer>
</Modal>

    </div>
  );
}
