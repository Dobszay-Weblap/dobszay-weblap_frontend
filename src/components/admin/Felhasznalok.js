import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, Modal, Table, Spinner, Alert, ListGroup } from 'react-bootstrap';
import { myAxios } from '../../contexts/MyAxios';
import "./Felhasznalok.css";

export default function Felhasznalok() {
  const [users, setUsers] = useState([]);
  const [csoportok, setCsoportok] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [editingEmail, setEditingEmail] = useState(null);
  const [editEmailValue, setEditEmailValue] = useState('');
  const [editingCsoport, setEditingCsoport] = useState(null);
  const [editCsoportValue, setEditCsoportValue] = useState('');
  const [error, setError] = useState(null);
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [showNewCsoportModal, setShowNewCsoportModal] = useState(false);
  const [showCsoportSorrendModal, setShowCsoportSorrendModal] = useState(false);
  const [newCsoportNev, setNewCsoportNev] = useState('');
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: 'Jelszo123',
    csoport_id: null,
    password_changed: false
  });
  
  const getSortedUsers = () => {
    return [...users].sort((a, b) => {
      const aGroup = a.csoportok && a.csoportok.length > 0 ? a.csoportok[0].id : null;
      const bGroup = b.csoportok && b.csoportok.length > 0 ? b.csoportok[0].id : null;
      
      if (aGroup === null && bGroup !== null) return 1;
      if (aGroup !== null && bGroup === null) return -1;
      
      if (aGroup === null && bGroup === null) {
        return a.id - b.id;
      }
      
      if (aGroup === bGroup) {
        return a.id - b.id;
      }
      
      const aCsoport = csoportok.find(c => c.id === aGroup);
      const bCsoport = csoportok.find(c => c.id === bGroup);
      
      return (aCsoport?.sorrend || 0) - (bCsoport?.sorrend || 0);
    });
  };

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
      setCsoportok(response.data.sort((a, b) => (a.sorrend || 0) - (b.sorrend || 0)));
    } catch (error) {
      console.error('Hiba a csoportok betöltésekor:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      setError('Nincs bejelentkezési token! Kérlek jelentkezz be.');
      setLoading(false);
      return;
    }
    
    fetchUsers();
    fetchCsoportok();
  }, []);

  // ✨ ÚJ FÜGGVÉNY: Automatikus ételrekordok létrehozása
  const createEtelekForCsoport = async (csoportId) => {
    try {
      // Lekérjük a kezdő dátumot
      const datumResponse = await myAxios.get('/api/kezdo-datum');
      const kezdoDatum = datumResponse.data.kezdoDatum;
      
      if (!kezdoDatum) {
        console.warn('Nincs beállítva kezdő dátum, ételrekordok nem létrehozhatók');
        return;
      }

      // Generáljuk a 7 napot
      const datumok = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(kezdoDatum);
        d.setDate(d.getDate() + i);
        return d.toISOString().split("T")[0];
      });

      // Lekérjük a csoport nevét
      const csoport = csoportok.find(c => c.id === csoportId);
      if (!csoport) {
        console.error('Csoport nem található');
        return;
      }

      // Létrehozzuk az ételrekordokat minden napra
      for (const datum of datumok) {
        await myAxios.post('/api/etelek', {
          nev: csoport.nev,
          datum: datum,
          csoport_id: csoportId,
          adag_A: 0,
          adag_B: 0,
          adag_C: 0
        });
      }

      console.log(`✅ Ételrekordok létrehozva: ${csoport.nev}`);
    } catch (error) {
      console.error('Hiba az ételrekordok létrehozásakor:', error);
      // Nem dobunk hibát, hogy ne akadjon el a felhasználó létrehozása
    }
  };

  const handleCreateUser = async () => {
    try {
      const response = await myAxios.post('/api/users', newUser);

      if (response.status === 201) {
        const createdUser = response.data;
        
        if (newUser.csoport_id) {
          // Csoporthoz rendelés
          await myAxios.put(`/api/users/${createdUser.id}/csoportok`, {
            csoportok: [newUser.csoport_id]
          });

          // ✨ Automatikusan létrehozzuk az ételrekordokat
          await createEtelekForCsoport(newUser.csoport_id);
        }

        setShowNewUserModal(false);
        setNewUser({
          name: '',
          email: '',
          password: 'Jelszo123',
          csoport_id: null,
          password_changed: false
        });
        fetchUsers();
        
        // Sikeres üzenet
        setError(null);
        alert('✅ Felhasználó és ételrekordok sikeresen létrehozva!');
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
        const ujCsoport = response.data;
        
        setShowNewCsoportModal(false);
        setNewCsoportNev('');
        fetchCsoportok();
        setError(null);

        // ✨ Automatikusan létrehozzuk az ételrekordokat az új csoporthoz is
        await createEtelekForCsoport(ujCsoport.id);
        
        alert('✅ Csoport és ételrekordok sikeresen létrehozva!');
      }
    } catch (error) {
      console.error('Hiba a csoport létrehozásakor:', error);
      setError('Nem sikerült létrehozni a csoportot. Lehet, hogy már létezik ilyen nevű csoport.');
    }
  };

  const handleUpdateCsoport = async (userId, csoportId) => {
    try {
      const user = users.find(u => u.id === userId);
      const regiCsoportId = user.csoportok && user.csoportok.length > 0 ? user.csoportok[0].id : null;
      
      if (editEmailValue && editEmailValue !== user.email) {
        await myAxios.put(`/api/users/${userId}`, {
          email: editEmailValue
        });
      }
      
      await myAxios.put(`/api/users/${userId}/csoportok`, {
        csoportok: csoportId ? [csoportId] : []
      });

      // ✨ Ha új csoportba került, létrehozzuk neki az ételrekordokat
      if (csoportId && csoportId !== regiCsoportId) {
        await createEtelekForCsoport(csoportId);
      }
      
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

  const handleUpdateCsoportNev = async (csoportId) => {
    if (!editCsoportValue.trim()) {
      setError('A csoport neve nem lehet üres!');
      return;
    }

    try {
      await myAxios.put(`/api/csoportok/${csoportId}`, {
        nev: editCsoportValue
      });
      
      setEditingCsoport(null);
      setEditCsoportValue('');
      setError(null);
      fetchCsoportok();
      fetchUsers();
    } catch (error) {
      console.error('Hiba a csoport átnevezésekor:', error);
      setError('Nem sikerült átnevezni a csoportot. Lehet, hogy már létezik ilyen nevű csoport.');
    }
  };

  const moveCsoportUp = (index) => {
    if (index === 0) return;
    const newCsoportok = [...csoportok];
    [newCsoportok[index - 1], newCsoportok[index]] = [newCsoportok[index], newCsoportok[index - 1]];
    setCsoportok(newCsoportok);
  };

  const moveCsoportDown = (index) => {
    if (index === csoportok.length - 1) return;
    const newCsoportok = [...csoportok];
    [newCsoportok[index], newCsoportok[index + 1]] = [newCsoportok[index + 1], newCsoportok[index]];
    setCsoportok(newCsoportok);
  };

  const saveCsoportSorrend = async () => {
    try {
      const csoportokWithSorrend = csoportok.map((csoport, index) => ({
        id: csoport.id,
        sorrend: index + 1
      }));

      await myAxios.put('/api/csoportok/sorrend', {
        csoportok: csoportokWithSorrend
      });

      setShowCsoportSorrendModal(false);
      setError(null);
      fetchCsoportok();
      fetchUsers();
    } catch (error) {
      console.error('Hiba a sorrend mentésekor:', error);
      setError('Nem sikerült menteni a sorrendet.');
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  const sortedUsers = getSortedUsers();

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
                  <Button variant="outline-secondary" className="me-2" onClick={() => setShowCsoportSorrendModal(true)}>
                    ⬍⬍ Csoportok sorrendje
                  </Button>
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

      <Modal show={showCsoportSorrendModal} onHide={() => {
        setShowCsoportSorrendModal(false);
        setEditingCsoport(null);
        setEditCsoportValue('');
        fetchCsoportok();
      }} size="md">
        <Modal.Header closeButton>
          <Modal.Title>📋 Csoportok kezelése</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted mb-3">
            <small>Használd a ▲▼ gombokat a sorrend változtatásához, vagy a ✏️ gombot a név szerkesztéséhez.</small>
          </p>
          <ListGroup>
            {csoportok
              .filter(c => c.nev.trim().toLowerCase() !== 'virág étterem')
              .map((csoport, index) => (
                <ListGroup.Item key={csoport.id} className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-2 flex-grow-1">
                    <Badge bg="secondary" style={{minWidth: '30px'}}>{index + 1}.</Badge>
                    {editingCsoport === csoport.id ? (
                      <Form.Control
                        type="text"
                        size="sm"
                        value={editCsoportValue}
                        onChange={(e) => setEditCsoportValue(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleUpdateCsoportNev(csoport.id);
                          }
                        }}
                        autoFocus
                        style={{maxWidth: '200px'}}
                      />
                    ) : (
                      <strong>{csoport.nev}</strong>
                    )}
                  </div>
                  <div className="d-flex gap-1">
                    {editingCsoport === csoport.id ? (
                      <>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleUpdateCsoportNev(csoport.id)}
                          title="Mentés"
                        >
                          ✓
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setEditingCsoport(null);
                            setEditCsoportValue('');
                          }}
                          title="Mégse"
                        >
                          ✕
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline-info"
                          size="sm"
                          onClick={() => {
                            setEditingCsoport(csoport.id);
                            setEditCsoportValue(csoport.nev);
                          }}
                          title="Átnevezés"
                        >
                          ✏️
                        </Button>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => moveCsoportUp(csoportok.findIndex(c => c.id === csoport.id))}
                          disabled={index === 0}
                          title="Fel"
                        >
                          ▲
                        </Button>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => moveCsoportDown(csoportok.findIndex(c => c.id === csoport.id))}
                          disabled={index === csoportok.filter(c => c.nev.trim().toLowerCase() !== 'virág étterem').length - 1}
                          title="Le"
                        >
                          ▼
                        </Button>
                      </>
                    )}
                  </div>
                </ListGroup.Item>
              ))}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
            setShowCsoportSorrendModal(false);
            setEditingCsoport(null);
            setEditCsoportValue('');
            fetchCsoportok();
          }}>
            Bezárás
          </Button>
          <Button variant="success" onClick={saveCsoportSorrend}>
            💾 Sorrend mentése
          </Button>
        </Modal.Footer>
      </Modal>

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
                placeholder="pl. Dorkáék"
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
                {csoportok
                  .filter(csoport => csoport.nev.trim().toLowerCase() !== 'virág étterem')
                  .map(csoport => (
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
                  {sortedUsers.map(user => (
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
                            {csoportok
                              .filter(csoport => csoport.nev.trim().toLowerCase() !== 'virág étterem')
                              .map(csoport => (
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