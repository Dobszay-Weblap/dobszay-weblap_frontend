import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, Modal, Table, Spinner, Alert } from 'react-bootstrap';
import { myAxios } from '../../contexts/MyAxios';

export default function Felhasznalok() {
  const [user, setUser] = useState([]);
  const [csoportok, setCsoportok] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState(null);
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [showNewCsoportModal, setShowNewCsoportModal] = useState(false);
  const [newCsoportNev, setNewCsoportNev] = useState('');
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: 'Jelszo123',
    csoportok: []
  });

  const fetchUsers = async () => {
    try {
      const response = await myAxios.get('/api/admin/users');
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Hiba a felhasználók betöltésekor:', error);
      setError('Nincs jogosultságod a felhasználók megtekintéséhez.');
      setLoading(false);
    }
  };

  const fetchCsoportok = async () => {
    try {
      const response = await myAxios.get('/api/csoportok');
      setCsoportok(response.data);
    } catch (error) {
      console.error('Hiba a csoportok betöltésekor:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchCsoportok();
  }, []);

  const handleCreateUser = async () => {
    try {
      const response = await myAxios.post('/api/users', newUser);

      if (response.status === 201) {
        const createdUser = response.data;
        
        if (newUser.csoportok.length > 0) {
          await myAxios.put(`/api/users/${createdUser.id}/csoportok`, {
            csoportok: newUser.csoportok
          });
        }

        setShowNewUserModal(false);
        setNewUser({
          name: '',
          email: '',
          password: 'Jelszo123',
          csoportok: []
        });
        fetchUsers();
      }
    } catch (error) {
      console.error('Hiba a felhasználó létrehozásakor:', error);
      setError('Nem sikerült létrehozni a felhasználót.');
    }
  };

  const handleCreateCsoport = async () => {
    try {
      const response = await myAxios.post('/api/csoportok', {
        nev: newCsoportNev
      });

      if (response.status === 201) {
        setShowNewCsoportModal(false);
        setNewCsoportNev('');
        fetchCsoportok();
        setError(null);
      }
    } catch (error) {
      console.error('Hiba a csoport létrehozásakor:', error);
      setError('Nem sikerült létrehozni a csoportot. Lehet, hogy már létezik ilyen nevű csoport.');
    }
  };

  const handleUpdateCsoportok = async (userId, csoportIds) => {
    try {
      await myAxios.put(`/api/users/${userId}/csoportok`, {
        csoportok: csoportIds
      });
      
      fetchUsers();
      setEditingUser(null);
    } catch (error) {
      console.error('Hiba a csoportok frissítésekor:', error);
      setError('Nem sikerült frissíteni a csoportokat.');
    }
  };

  const toggleCsoportForUser = (userId, csoportId) => {
    setUser(user.map(user => {
      if (user.id === userId) {
        const currentCsoportIds = user.csoportok.map(c => c.id);
        const newCsoportIds = currentCsoportIds.includes(csoportId)
          ? currentCsoportIds.filter(id => id !== csoportId)
          : [...currentCsoportIds, csoportId];
        
        return {
          ...user,
          csoportok: csoportok.filter(c => newCsoportIds.includes(c.id))
        };
      }
      return user;
    }));
  };

  const toggleCsoportForNewUser = (csoportId) => {
    setNewUser(prev => ({
      ...prev,
      csoportok: prev.csoportok.includes(csoportId)
        ? prev.csoportok.filter(id => id !== csoportId)
        : [...prev.csoportok, csoportId]
    }));
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <Row className="align-items-center">
                <Col>
                  <h1 className="mb-1">👥 Felhasználók kezelése</h1>
                  <p className="text-muted mb-0">Összesen {user.length} felhasználó • {csoportok.length} csoport</p>
                </Col>
                <Col xs="auto">
                  <Button variant="outline-primary" className="me-2" onClick={() => setShowNewCsoportModal(true)}>
                    ➕ Új csoport
                  </Button>
                  <Button variant="primary" onClick={() => setShowNewUserModal(true)}>
                    ➕ Új felhasználó
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {error && (
        <Row className="mb-3">
          <Col>
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          </Col>
        </Row>
      )}

      {/* Új csoport Modal */}
      <Modal show={showNewCsoportModal} onHide={() => setShowNewCsoportModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Új csoport létrehozása</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Csoport neve</Form.Label>
              <Form.Control
                type="text"
                value={newCsoportNev}
                onChange={(e) => setNewCsoportNev(e.target.value)}
                autoFocus
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowNewCsoportModal(false)}>
            Mégse
          </Button>
          <Button 
            variant="success" 
            onClick={handleCreateCsoport}
            disabled={!newCsoportNev.trim()}
          >
            Létrehozás
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Új felhasználó Modal */}
      <Modal show={showNewUserModal} onHide={() => setShowNewUserModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Új felhasználó hozzáadása</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Név</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Teljes név"
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="email@example.com"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Alert variant="info">
              <strong>Alapértelmezett jelszó:</strong> <code>Jelszo123</code>
            </Alert>

            <Form.Group className="mb-3">
              <Form.Label>Csoportok</Form.Label>
              <div className="d-flex flex-wrap gap-2">
                {csoportok.map(csoport => (
                  <Button
                    key={csoport.id}
                    variant={newUser.csoportok.includes(csoport.id) ? 'primary' : 'outline-secondary'}
                    size="sm"
                    onClick={() => toggleCsoportForNewUser(csoport.id)}
                  >
                    {csoport.nev}
                  </Button>
                ))}
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowNewUserModal(false)}>
            Mégse
          </Button>
          <Button 
            variant="success" 
            onClick={handleCreateUser}
            disabled={!newUser.name || !newUser.email}
          >
            Létrehozás
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Felhasználók táblázat */}
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Név</th>
                    <th>Email</th>
                    <th>Jogosultság</th>
                    <th>Csoportok</th>
                    <th className="text-center">Műveletek</th>
                  </tr>
                </thead>
                <tbody>
                  {user.map(user => (
                    <tr key={user.id}>
                      <td>
                        <strong>👤 {user.name}</strong>
                      </td>
                      <td>
                        {user.email}
                      </td>
                      <td>
                        <Badge 
                          bg={
                            user.jogosultsagi_szint === 'admin' ? 'danger' :
                            user.jogosultsagi_szint === 'felhasznalo' ? 'success' :
                            user.jogosultsagi_szint === 'nezo' ? 'info' : 'secondary'
                          }
                        >
                          {user.jogosultsagi_szint}
                        </Badge>
                      </td>
                      <td>
                        {editingUser === user.id ? (
                          <div className="d-flex flex-wrap gap-2">
                            {csoportok.map(csoport => (
                              <Button
                                key={csoport.id}
                                variant={user.csoportok.some(c => c.id === csoport.id) ? 'primary' : 'outline-secondary'}
                                size="sm"
                                onClick={() => toggleCsoportForUser(user.id, csoport.id)}
                              >
                                {csoport.nev}
                              </Button>
                            ))}
                          </div>
                        ) : (
                          <div className="d-flex flex-wrap gap-1">
                            {user.csoportok && user.csoportok.length > 0 ? (
                              user.csoportok.map(csoport => (
                                <Badge key={csoport.id} bg="primary" className="me-1">
                                  {csoport.nev}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-muted fst-italic">Nincs csoporthoz rendelve</span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="text-center">
                        {editingUser === user.id ? (
                          <div className="d-flex justify-content-center gap-2">
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => {
                                const csoportIds = user.csoportok.map(c => c.id);
                                handleUpdateCsoportok(user.id, csoportIds);
                              }}
                            >
                              ✅ Mentés
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => {
                                setEditingUser(null);
                                fetchUsers();
                              }}
                            >
                              ❌ Mégse
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => setEditingUser(user.id)}
                          >
                            ✏️ Csoportok szerkesztése
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {user.length === 0 && (
                <div className="text-center py-5">
                  <h3 className="text-muted mb-3">👥</h3>
                  <p className="text-muted">Még nincsenek felhasználók</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}