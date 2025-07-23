import React, { useState, useEffect } from "react";
import { myAxios } from "../contexts/MyAxios";
import "./Adatok.css";
import { Button, Modal } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";

const Adatok = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
   const { user} = useAuth();
   const [szerkesztesMod, setSzerkesztesMod] = useState(false);
    const [aktualisSzemely, setAktualisSzemely] = useState(null);


   function hierarchikusRendez(adatok) {
  const kodMap = new Map();
  adatok.forEach((item) => kodMap.set(String(item.matebazsi_kod), item));


  const gyerekMap = new Map();
  adatok.forEach((item) => {
    const kod = String(item.matebazsi_kod);
    const szuloKod = kod.slice(0, -1);
    if (!gyerekMap.has(szuloKod)) {
      gyerekMap.set(szuloKod, []);
    }
    gyerekMap.get(szuloKod).push(item);
  });

  const eredmeny = [];

  function bejar(szuloKod = "") {
    const gyerekek = (gyerekMap.get(szuloKod) || []).sort((a, b) =>
      String(a.matebazsi_kod).localeCompare(String(b.matebazsi_kod), undefined, { numeric: true })
    );

    for (const gyerek of gyerekek) {
      eredmeny.push(gyerek);
      bejar(String(gyerek.matebazsi_kod));
    }
  }

  bejar(); 

  return eredmeny;
}

const getSzuloKod = (kod) => {
  const str = String(kod);
  return str.slice(0, -1);
};

const findSzuloAdat = (kod) => {
  const szuloKod = getSzuloKod(kod);
  return adatok.find(a => String(a.matebazsi_kod) === szuloKod);
};



  // Család színek, most már a csaladsorszam alapján tárolva
  const csaladSzinek = {
    0: "#ffb3b3",    // Rózsaszín
    1: "#ff6666",    // Piros
    2: "#ffcc66",    // Narancs
    3: "#99ff99",    // Világoszöld
    4: "#66b3ff",    // Kék
    5: "#9e42bd",    // Lila
    6: "#d62727",    // Sötétebb piros
    7: "#996633",    // Barna
  };

  // Alapértelmezett szín, ha nem találunk családot
  const getCsaladSzin = (csaladsorszam) => csaladSzinek[csaladsorszam] || "#f0f0f0"; // Ha nincs szín, alapértelmezett

  const [adatok, setAdatok] = useState([]);
  const [ujCsaladtag, setUjCsaladtag] = useState({
    nev: "",
    mobil_telefonszam: "",
    vonalas_telefon: "",
    cim: "",
    szuletesi_ev: "",
    szulinap: "",
    nevnap: "",
    email: "",
    skype: "",
    csaladsorszam: "",
    matebazsi_kod: "",
    sor_szamlalo: "",
    becenev_sor: "",
    bankszamla: "",
    revolut_id: "",
    ki_ki: "",
    naptar: "",
    elso_generacio: "",
    unoka_generacio: "",
    dedunoka_generacio: "",
    szulo_id: ""
  });

  useEffect(() => {
    myAxios.get("api/csaladi-adatok")
      .then((response) => setAdatok(response.data))
      .catch((error) => console.error("Hiba az adatok lekérdezésekor:", error));
  }, []);

const handleChange = (e) => {
  const { name, value } = e.target;
  const updatedData = { ...ujCsaladtag, [name]: value };

  // Ha matebazsi_kod módosul, próbáljuk meg beállítani a szülőt is
  if (name === "matebazsi_kod") {
    const szulo = findSzuloAdat(value);
    if (szulo) {
      updatedData.szulo_id = szulo.id;
    } else {
      updatedData.szulo_id = ""; // Ha nem található
    }
  }

  setUjCsaladtag(updatedData);
};


 const handleSubmit = (e) => {
    e.preventDefault();

    if (szerkesztesMod && aktualisSzemely) {
      myAxios.put(`api/csaladi-adatok/${aktualisSzemely.id}`, ujCsaladtag)
        .then((response) => {
          const frissitett = adatok.map(a => a.id === aktualisSzemely.id ? response.data : a);
          setAdatok(frissitett);
          setIsModalOpen(false);
          setAktualisSzemely(null);
          setSzerkesztesMod(false);
        });
    } else {
      myAxios.post("api/csaladi-adatok", ujCsaladtag)
        .then((response) => {
          setAdatok([...adatok, response.data]);
          setIsModalOpen(false);
        })
        .catch((error) => console.error("Hiba:", error));
    }
  };
  
  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  // Modal bezárása
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

const rendezettAdatok = hierarchikusRendez(adatok);




  return (
    <div className="adatok">
      <h2>Családi Adatok</h2>
      <Button variant="primary" onClick={() => {
        setUjCsaladtag({
          nev: "", mobil_telefonszam: "", vonalas_telefon: "", cim: "",
          szuletesi_ev: "", szulinap: "", nevnap: "", email: "", skype: "",
          csaladsorszam: "", matebazsi_kod: "", sor_szamlalo: "", becenev_sor: "",
          bankszamla: "", revolut_id: "", ki_ki: "", naptar: "",
          elso_generacio: "", unoka_generacio: "", dedunoka_generacio: "", szulo_id: ""
        });
        setSzerkesztesMod(false);
        setIsModalOpen(true);
      }}>Új családtag hozzáadása</Button>

      <Button variant="primary" onClick={() => setSzerkesztesMod(true)}>Szerkesztés</Button>
      <Modal show={isModalOpen} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>{szerkesztesMod ? "Családtag szerkesztése" : "Új családtag hozzáadása"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <input type="text" name="nev" placeholder="Név" value={ujCsaladtag.nev} onChange={handleChange} required />
            	<input type="text" name="mobil_telefonszam" placeholder="Mobil" value={ujCsaladtag.mobil_telefonszam} onChange={handleChange} />
            	<input type="text" name="vonalas_telefon" placeholder="Vonalas" value={ujCsaladtag.vonalas_telefon} onChange={handleChange} />
            	<input type="text" name="cim" placeholder="Cím" value={ujCsaladtag.cim} onChange={handleChange} />
            	<input type="number" name="szuletesi_ev" placeholder="Születési év" value={ujCsaladtag.szuletesi_ev} onChange={handleChange} />
            	<input type="text" name="szulinap" placeholder="Szülinap" value={ujCsaladtag.szulinap} onChange={handleChange} />
            	<input type="text" name="nevnap" placeholder="Névnap" value={ujCsaladtag.nevnap} onChange={handleChange} />
            	<input type="email" name="email" placeholder="Email" value={ujCsaladtag.email} onChange={handleChange} />
            	<input type="text" name="skype" placeholder="Skype" value={ujCsaladtag.skype} onChange={handleChange} />
              <input type="text" name="csaladsorszam" placeholder="Családsorszám" value={ujCsaladtag.csaladsorszam} onChange={handleChange} />
              <input type="number" name="matebazsi_kod" placeholder="MátéBazsi kód" value={ujCsaladtag.matebazsi_kod} onChange={handleChange} />
              {/* {ujCsaladtag.matebazsi_kod && (
                (() => {
                  const szulo = findSzuloAdat(ujCsaladtag.matebazsi_kod);
                  return (
                    <div style={{ marginBottom: '8px', fontStyle: 'italic', fontSize: '0.9em' }}>
                      Ez a személy <strong>{szulo ? szulo.nev : `"${getSzuloKod(ujCsaladtag.matebazsi_kod)}"`}</strong> alá tartozik
                    </div>
                  );
                })()
              )} */}
              <input type="number" name="sor_szamlalo" placeholder="Sör számláló" value={ujCsaladtag.sor_szamlalo} onChange={handleChange} />
              <input type="text" name="becenev_sor" placeholder="Becenév" value={ujCsaladtag.becenev_sor} onChange={handleChange} />
              <input type="text" name="bankszamla" placeholder="Bankszámlaszám" value={ujCsaladtag.bankszamla} onChange={handleChange} />
              <input type="text" name="revolut_id" placeholder="Revolut ID" value={ujCsaladtag.revolut_id} onChange={handleChange} />
              <input type="text" name="ki_ki" placeholder="" value={ujCsaladtag.ki_ki} onChange={handleChange} />
              <input type="number" name="naptar" placeholder="Naptár" value={ujCsaladtag.naptar} onChange={handleChange} />
              <input type="number" name="elso_generacio" placeholder="Első generáció" value={ujCsaladtag.elso_generacio} onChange={handleChange} />
              <input type="number" name="unoka_generacio" placeholder="Unoka generáció" value={ujCsaladtag.unoka_generacio} onChange={handleChange} />
              <input type="number" name="dedunoka_generacio" placeholder="Dédunoka generáció" value={ujCsaladtag.dedunoka_generacio} onChange={handleChange} />

          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Mégse</Button>
          <Button variant="primary" onClick={handleSubmit}>{szerkesztesMod ? "Mentés" : "Hozzáadás"}</Button>
        </Modal.Footer>
      </Modal>
      <div className="adatok-table-container">
        <table className="adatok-table">
          <thead>
            <tr>
              <th>Név</th>
              <th>Mobil</th>
              <th>Vonalas</th>
              <th>Cím</th>
              <th>Születési év</th>
              <th>Szülinap</th>
              <th>Névnap</th>
              <th>Email</th>
              <th>Skype</th>
              <th>Családsorszám</th>
              <th>MátéBazsi kód</th>
              <th>Sör számláló</th>
              <th>Becenév</th>
              <th>Bankszámlaszám</th>
              <th>Revolut ID</th>
              <th></th>
              <th>Naptár</th>
              <th>Első generáció</th>
              <th>Unoka generáció</th>
              <th>Dédunoka generáció</th>
            </tr>
            
          </thead>
           <tbody>
            {rendezettAdatok.map((adat) => (
              <tr
                key={adat.id}
                onClick={() => {
                  if (szerkesztesMod) {
                    setUjCsaladtag(adat);
                    setAktualisSzemely(adat);
                    setIsModalOpen(true);
                  }
                }}
                style={{ backgroundColor: getCsaladSzin(adat.csaladsorszam), cursor: szerkesztesMod ? "pointer" : "default" }}
              >
                <td>{adat.nev}</td>
                <td>{adat.mobil_telefonszam || ""}</td>
                <td>{adat.vonalas_telefon || ""}</td>
                <td>{adat.cim || ""}</td>
                <td>{adat.szuletesi_ev || "N/A"}</td>
                <td>{adat.szulinap || ""}</td>
                <td>{adat.nevnap || ""}</td>
                <td>{adat.email || ""}</td>
                <td>{adat.skype || ""}</td>
                <td>{adat.csaladsorszam || "-"}</td>
                <td>{adat.matebazsi_kod || "-"}</td>
                <td>{adat.sor_szamlalo}</td>
                <td>{adat.becenev_sor || "-"}</td>
                <td>{adat.bankszamla || ""}</td>
                <td>{adat.revolut_id || ""}</td>
                <td>{adat.ki_ki || ""}</td>
                <td>{adat.naptar}</td>
                <td>{adat.elso_generacio || "-"}</td>
                <td>{adat.unoka_generacio || "-"}</td>
                <td>{adat.dedunoka_generacio || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Adatok;
