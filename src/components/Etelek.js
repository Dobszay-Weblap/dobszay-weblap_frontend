import React, { useState, useEffect } from "react";
import { myAxios } from "../contexts/MyAxios";
import "./Etelek.css";
import { useAuth } from "../contexts/AuthContext";

const Etelek = () => {
   const { user} = useAuth();


  // Alapértelmezett szín, ha nem találunk családot

  const [adatok, setAdatok] = useState([]);


  useEffect(() => {
    myAxios.get("api/etelek")
      .then((response) => setAdatok(response.data))
      .catch((error) => console.error("Hiba az adatok lekérdezésekor:", error));
  }, []);

  

  return (
    <div className="adatok">
      <h2>Kápcsi kaja táblázat</h2>
      <h1>Hétfői</h1>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Főétel A</th>
              <th>Főétel B</th>
              <th>Főétel C</th>
              <th>Leves</th>
              <th>Adagok</th>
              <th>Megjegyzés</th>
              
            </tr>
          </thead>
          <tbody>
            {adatok.map((adat) => (
              <tr>
                <td>{adat.nev}</td>
                <td>{adat.mobil_telefonszam || ""}</td>
                <td>{adat.vonalas_telefon || ""}</td>
                <td>{adat.cim || ""}</td>
                <td>{adat.szuletesi_ev || "N/A"}</td>
                <td>{adat.szulinap || ""}</td>
                <td>{adat.nevnap || ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h1>Keddi</h1>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Főétel A</th>
              <th>Főétel B</th>
              <th>Főétel C</th>
              <th>Leves</th>
              <th>Adagok</th>
              <th>Megjegyzés</th>
              
            </tr>
          </thead>
          <tbody>
            {adatok.map((adat) => (
              <tr>
                <td>{adat.nev}</td>
                <td>{adat.mobil_telefonszam || ""}</td>
                <td>{adat.vonalas_telefon || ""}</td>
                <td>{adat.cim || ""}</td>
                <td>{adat.szuletesi_ev || "N/A"}</td>
                <td>{adat.szulinap || ""}</td>
                <td>{adat.nevnap || ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Etelek;
