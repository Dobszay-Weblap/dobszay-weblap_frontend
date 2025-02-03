import React, { useState, useEffect } from "react";
import { myAxios } from "../contexts/MyAxios";
import "./Adatok.css";


const Adatok = () => {
  const [adatok, setAdatok] = useState([]);

  useEffect(() => {
    myAxios.get("api/csaladi-adatok")
      .then((response) => setAdatok(response.data))
      .catch((error) => console.error("Hiba az adatok lekérdezésekor:", error));
  }, []);

  return (
    <div>
      <h2>Családi Adatok</h2>
      <table border="1">
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
            <th>Becenév a sör számlálóban</th>
            <th>Bankszámlaszám</th>
            <th>Revolut ID</th>
            <th>Naptár</th>
            <th>Első generáció</th>
            <th>Unoka generáció</th>
            <th>Dédunoka generáció</th>
          </tr>
        </thead>
        <tbody>
          {adatok.map((adat) => (
            <tr key={adat.id}>
              <td>{adat.nev}</td>
              <td>{adat.mobil_telefonszam || "Nincs megadva"}</td>
              <td>{adat.vonalas_telefon || "Nincs megadva"}</td>
              <td>{adat.cim || "Nincs megadva"}</td>
              <td>{adat.szuletesi_ev || "N/A"}</td>
              <td>{adat.szulinap || "Nincs adat"}</td>
              <td>{adat.nevnap || "Nincs adat"}</td>
              <td>{adat.email || "Nincs megadva"}</td>
              <td>{adat.skype || "Nincs megadva"}</td>
              <td>{adat.csaladsorszam || "-"}</td>
              <td>{adat.matebazsi_kod || "-"}</td>
              <td>{adat.sor_szamlalo}</td>
              <td>{adat.becenev_sor || "-"}</td>
              <td>{adat.bankszamla || "Nincs megadva"}</td>
              <td>{adat.revolut_id || "Nincs megadva"}</td>
              <td>{adat.naptar}</td>
              <td>{adat.elso_generacio || "-"}</td>
              <td>{adat.unoka_generacio || "-"}</td>
              <td>{adat.dedunoka_generacio || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Adatok;
