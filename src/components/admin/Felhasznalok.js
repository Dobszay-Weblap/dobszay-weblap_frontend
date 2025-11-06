import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, Modal, Table, Spinner, Alert } from 'react-bootstrap';
import { myAxios } from '../../contexts/MyAxios';
import "./Felhasznalok.css";

export default function Felhasznalok() {
  const [users, setUsers] = useState([]);
  const [csoportok, setCsoportok] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [editingEmail, setEditingEmail] = useState(null);
  const [editEmailValue, setEditEmailValue] = useState('');
  const [error, setError] = useState(null);
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [showNewCsoportModal, setShowNewCsoportModal] = useState(false);
  const [newCsoportNev, setNewCsoportNev] = useState('');
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: 'Jelszo123',
    csoport_id: null
  });

  const fetchUsers = async () => {
    try {
      const response = await myAxios.get('/api/admin/users');
      setUsers(response.data);
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
    const token = localStorage.getItem('auth_token');
    //console.log('🔑 Token:', token ? 'Van ✅' : 'NINCS ❌');
    
    if (!token) {
      setError('Nincs bejelentkezési token! Kérlek jelentkezz be.');
      setLoading(false);
      return;
    }
    
    fetchUsers();
    fetchCsoportok();
  }, []);

  const handleCreateUser = async () => {
    try {
      const response = await myAxios.post('/api/users', newUser);

      if (response.status === 201) {
        const createdUser = response.data;
        
        if (newUser.csoport_id) {
          await myAxios.put(`/api/users/${createdUser.id}/csoportok`, {
            csoportok: [newUser.csoport_id]
          });
        }

        setShowNewUserModal(false);
        setNewUser({
          name: '',
          email: '',
          password: 'Jelszo123',
          csoport_id: null
        });
        fetchUsers();
      }
    } catch (error) {
      console.error('Hiba a felhasználó létrehozásakor:', error);
      setError('Nem sikerült létrehozni a felhasználót.');
    }
  };

  const handleCreateCsoport = async () => {
    if (!newCsoportNev.trim()) return;
    
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

  const handleUpdateCsoport = async (userId, csoportId) => {
    try {
      // Először frissítjük az emailt, ha változott
      const user = users.find(u => u.id === userId);
      if (editEmailValue && editEmailValue !== user.email) {
        await myAxios.put(`/api/users/${userId}`, {
          email: editEmailValue
        });
      }
      
      // Aztán a csoportot
      await myAxios.put(`/api/users/${userId}/csoportok`, {
        csoportok: csoportId ? [csoportId] : []
      });
      
      fetchUsers();
      setEditingUser(null);
      setEditingEmail(null);
      setEditEmailValue('');
    } catch (error) {
      console.error('Hiba a frissítéskor:', error);
      setError('Nem sikerült frissíteni az adatokat.');
    }
  };

  const handleUpdateEmail = async (userId) => {
    try {
      await myAxios.put(`/api/users/${userId}`, {
        email: editEmailValue
      });
      
      fetchUsers();
      setEditingEmail(null);
      setEditEmailValue('');
      setError(null);
    } catch (error) {
      console.error('Hiba az email frissítésekor:', error);
      setError('Nem sikerült frissíteni az email címet. Lehet, hogy már használatban van.');
    }
  };

  const selectCsoportForUser = (userId, csoportId) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        const selectedCsoport = csoportok.find(c => c.id === csoportId);
        return {
          ...user,
          csoportok: selectedCsoport ? [selectedCsoport] : []
        };
      }
      return user;
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
                  <p className="text-muted mb-0">Összesen {users.length} felhasználó • {csoportok.length} csoport</p>
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
                placeholder="pl. Családnév"
                value={newCsoportNev}
                onChange={(e) => setNewCsoportNev(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleCreateCsoport();
                  }
                }}
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
              <Form.Label>Csoport</Form.Label>
              <Form.Select 
                value={newUser.csoport_id || ''} 
                onChange={(e) => setNewUser({...newUser, csoport_id: e.target.value ? parseInt(e.target.value) : null})}
              >
                <option value="">Nincs csoport</option>
                {csoportok.map(csoport => (
                  <option key={csoport.id} value={csoport.id}>
                    {csoport.nev}
                  </option>
                ))}
              </Form.Select>
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
                    <th className="text-center">Csoport</th>
                    <th className="text-center">Műveletek</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>
                        <strong>{user.name}</strong>
                      </td>
                      <td>
                        {editingEmail === user.id ? (
                          <div className="d-flex gap-2">
                            <Form.Control
                              type="email"
                              size="sm"
                              value={editEmailValue}
                              onChange={(e) => setEditEmailValue(e.target.value)}
                              autoFocus
                            />
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handleUpdateEmail(user.id)}
                            >
                              ✓
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => {
                                setEditingEmail(null);
                                setEditEmailValue('');
                              }}
                            >
                              ✕
                            </Button>
                          </div>
                        ) : (
                          <span>{user.email}</span>
                        )}
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
                      <td className="text-center">
                        {editingUser === user.id ? (
                          <Form.Select 
                            size="sm"
                            value={user.csoportok && user.csoportok.length > 0 ? user.csoportok[0].id : ''}
                            onChange={(e) => selectCsoportForUser(user.id, e.target.value ? parseInt(e.target.value) : null)}
                          >
                            <option value="">Nincs csoport</option>
                            {csoportok.map(csoport => (
                              <option key={csoport.id} value={csoport.id}>
                                {csoport.nev}
                              </option>
                            ))}
                          </Form.Select>
                        ) : (
                          <div>
                            {user.csoportok && user.csoportok.length > 0 ? (
                              <Badge bg="primary">
                                {user.csoportok[0].nev}
                              </Badge>
                            ) : (
                              <span className="text-muted fst-italic">Nincs csoport</span>
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
                                const csoportId = user.csoportok && user.csoportok.length > 0 
                                  ? user.csoportok[0].id 
                                  : null;
                                handleUpdateCsoport(user.id, csoportId);
                              }}
                            >
                              ✅ Mentés
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => {
                                setEditingUser(null);
                                setEditingEmail(null);
                                setEditEmailValue('');
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
                            onClick={() => {
                              setEditingUser(user.id);
                              setEditingEmail(user.id);
                              setEditEmailValue(user.email);
                            }}
                          >
                            ✏️ Szerkesztés
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {users.length === 0 && (
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