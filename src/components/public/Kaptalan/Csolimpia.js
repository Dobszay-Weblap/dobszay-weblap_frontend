import { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Card, Alert, Spinner } from 'react-bootstrap';
import { Plus, Pencil, Trash, CheckLg, XLg } from 'react-bootstrap-icons';
import { myAxios } from '../../../contexts/MyAxios';


const Csolimpia = () => {
  const [versenyszamok, setVersenyszamok] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [szervezok, setSzervezok] = useState({
      indulok: '',
      szul_ev: '',
      evfolyam: '',
      futas: '',
      celbadobas: '',
      sakk: '',
      bicikli_futobicikli: '',
      motor_biciklitura_gyerek: '',
      rajz: '',
      kincskereses: '',
      uszas_uszogumi: '',
      sup: '',
    });


  const [hiba, setHiba] = useState('');

  // Adatok betöltése a backendből
  useEffect(() => {
    const betoltAdatok = async () => {
      setLoading(true);
      try {
      const [versenyszamRes, szervezokRes] = await Promise.all([
        myAxios.get('/api/versenyszamok'),
        myAxios.get('/api/szervezok'),
      ]);
      setVersenyszamok(versenyszamRes.data);
      setSzervezok(szervezokRes.data[0] || {});
      } catch (error) {
        console.error('Hiba az adatok betöltésekor:', error);
        setHiba('Nem sikerült betölteni az adatokat.');
      } finally {
        setLoading(false);
      }
    };
    betoltAdatok();
  }, []);

  const emptyForm = {
    indulok: '',
    szul_ev: '',
    evfolyam: '',
    futas: '',
    celbadobas: '',
    sakk: '',
    bicikli_futobicikli: '',
    motor_biciklitura_gyerek: '',
    rajz: '',
    kincskereses: '',
    uszas_uszogumi: '',
    sup: '',
  };

  // Új hozzáadása
  const handleAdd = () => {
    setIsAdding(true);
    setFormData(emptyForm);
  };

  // Mentés (új vagy módosított rekord)
  const handleSave = async () => {
    try {
      if (isAdding) {
        const response = await myAxios.post('api/versenyszamok', formData);
        setVersenyszamok([...versenyszamok, response.data]);
        setIsAdding(false);
      } else if (isEditing) {
        await myAxios.put(`api/versenyszamok/${isEditing}`, formData);
        setVersenyszamok(
          versenyszamok.map(v => (v.id === isEditing ? formData : v))
        );
        setIsEditing(null);
      }
      setFormData({});
    } catch (error) {
      console.error('Hiba mentéskor:', error);
      setHiba('Nem sikerült elmenteni az adatokat.');
    }
  };

  // Törlés
  const handleDelete = async (id) => {
    if (window.confirm('Biztosan törölni szeretnéd?')) {
      try {
        await myAxios.delete(`api/versenyszamok/${id}`);
        setVersenyszamok(versenyszamok.filter(v => v.id !== id));
      } catch (error) {
        console.error('Hiba törléskor:', error);
        setHiba('Nem sikerült törölni az adatot.');
      }
    }
  };

// Új szervező hozzáadása
const handleSaveSzervezok = async () => {
  try {
    const kuldendo = {
      ...szervezok,
      sup: String(szervezok.sup || ''), // biztosan string lesz
    };

    //console.log("Küldött adatok:", kuldendo);

    await myAxios.post('api/szervezok', kuldendo);
    //alert('Szervezők elmentve!');
  } catch (error) {
    console.error('Szervezők mentése sikertelen:', error);
    setHiba('Nem sikerült elmenteni a szervezőket.');
  }
};

  // Szerkesztés
  const handleEdit = (item) => {
    setIsEditing(item.id);
    setFormData(item);
  };

  const handleCancel = () => {
    setIsEditing(null);
    setIsAdding(false);
    setFormData({});
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const columns = [
    { key: 'indulok', label: 'Indulók' },
    { key: 'szul_ev', label: 'Születési év' },
    { key: 'evfolyam', label: 'Évfolyam' },
    { key: 'futas', label: 'Futás' },
    { key: 'celbadobas', label: 'Célbadobás' },
    { key: 'sakk', label: 'Sakk' },
    { key: 'bicikli_futobicikli', label: 'Bicikli / Futóbicikli' },
    { key: 'motor_biciklitura_gyerek', label: 'Motoros túra (gyerek)' },
    { key: 'rajz', label: 'Rajz' },
    { key: 'kincskereses', label: 'Kincskeresés' },
    { key: 'uszas_uszogumi', label: 'Úszás / Úszógumi' },
    { key: 'sup', label: 'SUP' },
  ];

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" /> Betöltés...
      </Container>
    );
  }

  if (hiba) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{hiba}</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <Card>
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Versenyszámok 2024/2025</h4>
          <Button variant="light" onClick={handleAdd}>
            <Plus className="me-1" /> Új hozzáadása
          </Button>
        </Card.Header>

        <Card.Body className="p-0">
          <Table bordered hover responsive className=" text-center">
            <thead className="table-light">
              <tr>
                {columns.map(col => (
                  <th key={col.key}>{col.label}</th>
                ))}
                <th>Műveletek</th>
              </tr>
            </thead>
            <tbody>
              {isAdding && (
                <tr className="s">
                  {columns.map(col => (
                    <td key={col.key}>
                      {col.key === 'sup' ? (
                        <Form.Check
                          type="checkbox"
                          checked={formData[col.key] || false}
                          onChange={(e) => handleChange(col.key, e.target.checked)}
                        />
                      ) : (
                        <Form.Control
                          type="text"
                          value={formData[col.key] || ''}
                          onChange={(e) => handleChange(col.key, e.target.value)}
                        />
                      )}
                    </td>
                  ))}
                  <td>
                    <div className="">
                      <Button variant="success" size="sm" onClick={handleSave}><CheckLg /></Button>
                      <Button variant="secondary" size="sm" onClick={handleCancel}><XLg /></Button>
                    </div>
                  </td>
                </tr>
              )}

              {versenyszamok.map((item) => (
                <tr key={item.id} className={isEditing === item.id ? 'table-info' : ''}>
                  {columns.map(col => (
                    <td key={col.key}>
                      {isEditing === item.id ? (
                        col.key === 'sup' ? (
                          <Form.Check
                            type="checkbox"
                            checked={formData[col.key] || false}
                            onChange={(e) => handleChange(col.key, e.target.checked)}
                          />
                        ) : (
                          <Form.Control
                            type="text"
                            value={formData[col.key] || ''}
                            onChange={(e) => handleChange(col.key, e.target.value)}
                          />
                        )
                      ) : (
                        col.key === 'sup'
                          ? (item[col.key] ? '✓' : '')
                          : (item[col.key] || '')
                      )}
                    </td>
                  ))}
                  <td>
                    {isEditing === item.id ? (
                      <div className="d-flex justify-content-center gap-2">
                        <Button variant="success" size="sm" onClick={handleSave}><CheckLg /></Button>
                        <Button variant="secondary" size="sm" onClick={handleCancel}><XLg /></Button>
                      </div>
                    ) : (
                      <div className="d-flex justify-content-center gap-2">
                        <Button variant="primary" size="sm" onClick={() => handleEdit(item)}><Pencil /></Button>
                        <Button variant="danger" size="sm" onClick={() => handleDelete(item.id)}><Trash /></Button>
                      </div>
                    )}
                  </td>
                  

                </tr>
                
              ))}
            </tbody>
            <tfoot>
  <tr className="table-secondary">
    <td><strong>Szervező felnőttek:</strong></td>
    <td></td>
    <td></td>
    <td>
      <Form.Control
        type="text"
        placeholder="Futás"
        value={szervezok.futas || ''}
        onChange={(e) => setSzervezok({ ...szervezok, futas: e.target.value })}
      />
    </td>
    <td>
      <Form.Control
        type="text"
        placeholder="Célbadobás"
        value={szervezok.celbadobas || ''}
        onChange={(e) => setSzervezok({ ...szervezok, celbadobas: e.target.value })}
      />
    </td>
    <td>
      <Form.Control
        type="text"
        placeholder="Sakk"
        value={szervezok.sakk || ''}
        onChange={(e) => setSzervezok({ ...szervezok, sakk: e.target.value })}
      />
    </td>
    <td>
      <Form.Control
        type="text"
        placeholder="Bicikli"
        value={szervezok.bicikli_futobicikli || ''}
        onChange={(e) => setSzervezok({ ...szervezok, bicikli_futobicikli: e.target.value })}
      />
    </td>
    <td>
      <Form.Control
        type="text"
        placeholder="Motoros túra"
        value={szervezok.motor_biciklitura_gyerek || ''}
        onChange={(e) => setSzervezok({ ...szervezok, motor_biciklitura_gyerek: e.target.value })}
      />
    </td>
    <td>
      <Form.Control
        type="text"
        placeholder="Rajz"
        value={szervezok.rajz || ''}
        onChange={(e) => setSzervezok({ ...szervezok, rajz: e.target.value })}
      />
    </td>
    <td>
      <Form.Control
        type="text"
        placeholder="Kincskeresés"
        value={szervezok.kincskereses || ''}
        onChange={(e) => setSzervezok({ ...szervezok, kincskereses: e.target.value })}
      />
    </td>
    <td>
      <Form.Control
        type="text"
        placeholder="Úszás"
        value={szervezok.uszas_uszogumi || ''}
        onChange={(e) => setSzervezok({ ...szervezok, uszas_uszogumi: e.target.value })}
      />
    </td>
    <td>
      <Form.Control
        type="text"
        placeholder="SUP"
        value={szervezok.sup || ''}
        onChange={(e) => setSzervezok({ ...szervezok, sup: e.target.value })}
      />
    </td>
    <td>
      <Button variant="success" size="sm" onClick={handleSaveSzervezok}>
        <CheckLg />
      </Button>
    </td>
  </tr>
</tfoot>


          </Table>
        </Card.Body>

        <Card.Footer className="text-muted">
          Összesen: <strong>{versenyszamok.length}</strong> résztvevő
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default Csolimpia;
