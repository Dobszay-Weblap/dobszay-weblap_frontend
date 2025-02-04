import React, { useState, useEffect } from "react";
import { myAxios } from "../contexts/MyAxios";
import "./Adatok.css";

const Adatok = () => {
  // Család színek, most már a csaladsorszam alapján tárolva
  const csaladSzinek = {
    0: "#ffb3b3",    // Rózsaszín
    1: "#ff6666",    // Piros
    2: "#ffcc66",    // Narancs
    3: "#99ff99",    // Világoszöld
    4: "#66b3ff",    // Kék
    5: "#9900cc",    // Lila
    6: "#b30000",    // Sötétebb piros
    7: "#996633",    // Barna
  };

  // Alapértelmezett szín, ha nem találunk családot
  const getCsaladSzin = (csaladsorszam) => csaladSzinek[csaladsorszam] || "#f0f0f0"; // Ha nincs szín, alapértelmezett

  const [adatok, setAdatok] = useState([]);

  useEffect(() => {
    myAxios.get("api/csaladi-adatok")
      .then((response) => setAdatok(response.data))
      .catch((error) => console.error("Hiba az adatok lekérdezésekor:", error));
  }, []);

  return (
    <div>
      <h2>Családi Adatok</h2>
      <div className="table-container">
        <table>
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
            {adatok.map((adat) => (
              <tr key={adat.id} style={{ backgroundColor: getCsaladSzin(adat.csaladsorszam) }}>
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
