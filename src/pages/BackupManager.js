import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Spinner, Alert, Badge } from 'react-bootstrap';
import { myAxios } from '../../contexts/MyAxios';

export default function BackupManager() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [backups, setBackups] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchBackups();
  }, []);

  const createBackup = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await myAxios.get('/api/admin/backup/create');
      setMessage('✅ ' + response.data.message);
      await fetchBackups();
    } catch (error) {
      setMessage('❌ Hiba történt a backup létrehozásakor');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBackups = async () => {
    setFetching(true);
    try {
      const response = await myAxios.get('/api/admin/backup/list');
      setBackups(response.data);
    } catch (error) {
      console.error('Hiba a backupok betöltésekor:', error);
    } finally {
      setFetching(false);
    }
  };

  const downloadBackup = (filename) => {
    window.open(`http://localhost:8000/api/admin/backup/download/${filename}`, '_blank');
  };

  const deleteBackup = async (filename) => {
    if (!window.confirm(`Biztosan törölni szeretnéd ezt a mentést?\n${filename}`)) {
      return;
    }

    try {
      await myAxios.delete(`/api/admin/backup/delete/${filename}`);
      setMessage('✅ Backup törölve');
      await fetchBackups();
    } catch (error) {
      setMessage('❌ Hiba történt a törlés során');
      console.error(error);
    }
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <Row className="align-items-center">
                <Col>
                  <h1 className="mb-1">💾 Adatbázis mentések</h1>
                  <p className="text-muted mb-0">
                    Összesen {backups.length} mentés
                  </p>
                </Col>
                <Col xs="auto">
                  <Button 
                    variant="success" 
                    onClick={createBackup} 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Mentés készítése...
                      </>
                    ) : (
                      <>📥 Új mentés létrehozása</>
                    )}
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {message && (
        <Row className="mb-3">
          <Col>
            <Alert 
              variant={message.includes('✅') ? 'success' : 'danger'} 
              onClose={() => setMessage('')} 
              dismissible
            >
              {message}
            </Alert>
          </Col>
        </Row>
      )}

      <Row>
        <Col>
          <Card>
            <Card.Body>
              {fetching ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : backups.length === 0 ? (
                <div className="text-center py-5">
                  <h3 className="text-muted mb-3">💾</h3>
                  <p className="text-muted">Még nincsenek mentések</p>
                </div>
              ) : (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Fájlnév</th>
                      <th>Méret</th>
                      <th>Létrehozva</th>
                      <th className="text-center">Műveletek</th>
                    </tr>
                  </thead>
                  <tbody>
                    {backups.map(backup => (
                      <tr key={backup.filename}>
                        <td>
                          <code>{backup.filename}</code>
                        </td>
                        <td>
                          <Badge bg="secondary">{backup.size_mb} MB</Badge>
                        </td>
                        <td>{backup.date}</td>
                        <td className="text-center">
                          <Button
                            variant="primary"
                            size="sm"
                            className="me-2"
                            onClick={() => downloadBackup(backup.filename)}
                          >
                            ⬇️ Letöltés
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => deleteBackup(backup.filename)}
                          >
                            🗑️ Törlés
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}