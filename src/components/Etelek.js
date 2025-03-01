import React, { useState, useEffect } from "react";
import { myAxios } from "../contexts/MyAxios";
import "./Etelek.css";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "react-bootstrap";

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
      {user?.jogosultsagi_szint === "felhasznalo" && (
        <div>
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
              <th className="megjegyzes">Megjegyzés</th>
              
            </tr>
          </thead>
          <tbody>
          <tr><td>2025.07.28</td>
                <td>Sajtos tejfölös spagetti</td>
                <td>Borsostokány tésztával</td>
                <td>Görögapró pecsenye hasábkrumpli</td>
                <td>Kertészleves</td>
                <td >ÖSSZESEN</td>
                <td className="megjegyzes"></td>
                </tr>
                <tr><td>Ágiék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Lucáék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Tamásék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Zsófiék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Péterék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Jánosék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Kláráék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Miklósék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Eszterék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Katiék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Gergőék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Mareszék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Ritáék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Ambrusék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Balázsék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Boriék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Julcssiék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Pannáék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Marci</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr className="osszesito"><td>Hétfői összesítő</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>

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
              <th className="megjegyzes">Megjegyzés</th>
              
            </tr>
          </thead>
          <tbody>
          <tr><td>2025.07.28</td>
                <td>Sajtos tejfölös spagetti</td>
                <td>Borsostokány tésztával</td>
                <td>Görögapró pecsenye hasábkrumpli</td>
                <td>Kertészleves</td>
                <td>ÖSSZESEN</td>
                <td className="megjegyzes"></td>
                </tr>
                <tr><td>Ágiék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Lucáék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Tamásék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Zsófiék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Péterék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Jánosék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Kláráék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Miklósék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Eszterék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Katiék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Gergőék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Mareszék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Ritáék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Ambrusék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Balázsék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Boriék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Julcssiék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Pannáék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Marci</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr className="osszesito"><td>Hétfői összesítő</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
          </tbody>
        </table>
      </div>
      <h1>Szerdai</h1>
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
              <th className="megjegyzes">Megjegyzés</th>
              
            </tr>
          </thead>
          <tbody>
          <tr><td>2025.07.28</td>
                <td>Sajtos tejfölös spagetti</td>
                <td>Borsostokány tésztával</td>
                <td>Görögapró pecsenye hasábkrumpli</td>
                <td>Kertészleves</td>
                <td>ÖSSZESEN</td>
                <td className="megjegyzes"></td>
                </tr>
                <tr><td>Ágiék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Lucáék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Tamásék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Zsófiék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Péterék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Jánosék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Kláráék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Miklósék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Eszterék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Katiék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Gergőék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Mareszék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Ritáék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Ambrusék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Balázsék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Boriék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Julcssiék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Pannáék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Marci</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr className="osszesito"><td>Hétfői összesítő</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
          </tbody>
        </table>
      </div>
      <h1>Csütörtöki</h1>
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
              <th className="megjegyzes">Megjegyzés</th>
              
            </tr>
          </thead>
          <tbody>
          <tr><td>2025.07.28</td>
                <td>Sajtos tejfölös spagetti</td>
                <td>Borsostokány tésztával</td>
                <td>Görögapró pecsenye hasábkrumpli</td>
                <td>Kertészleves</td>
                <td>ÖSSZESEN</td>
                <td className="megjegyzes"></td>
                </tr>
                <tr><td>Ágiék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Lucáék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Tamásék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Zsófiék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Péterék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Jánosék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Kláráék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Miklósék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Eszterék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Katiék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Gergőék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Mareszék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Ritáék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Ambrusék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Balázsék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Boriék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Julcssiék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Pannáék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Marci</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr className="osszesito"><td>Hétfői összesítő</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>  </tbody>
        </table>
      </div>
      <h1>Pénteki</h1>
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
              <th className="megjegyzes">Megjegyzés</th>
              
            </tr>
          </thead>
          <tbody>
          <tr><td>2025.07.28</td>
                <td>Sajtos tejfölös spagetti</td>
                <td>Borsostokány tésztával</td>
                <td>Görögapró pecsenye hasábkrumpli</td>
                <td>Kertészleves</td>
                <td>ÖSSZESEN</td>
                <td className="megjegyzes"></td>
                </tr>
                <tr><td>Ágiék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Lucáék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Tamásék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Zsófiék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Péterék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Jánosék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Kláráék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Miklósék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Eszterék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Katiék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Gergőék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Mareszék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Ritáék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Ambrusék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Balázsék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Boriék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Julcssiék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Pannáék</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Marci</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr className="osszesito"><td>Hétfői összesítő</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                          </tbody>
        </table>
      </div>
      <h1>Szombati</h1>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Főétel </th>
              <th>Leves</th>
              <th>Adagok</th>
              <th className="megjegyzes">Megjegyzés</th>
              
            </tr>
          </thead>
          <tbody>
          <tr><td>2025.07.28</td>
                <td>Csirkepapirkás tarhonya		</td>
                <td>Zöldségleves</td>
                <td>ÖSSZESEN</td>
                <td className="megjegyzes"></td>
                </tr>
                <tr><td>Ágiék</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td  className="megjegyzes"></td></tr>
                <tr><td>Lucáék</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td  className="megjegyzes"></td></tr>
                <tr><td>Tamásék</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td  className="megjegyzes"></td></tr>
                <tr><td>Zsófiék</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td  className="megjegyzes"></td></tr>
                <tr><td>Péterék</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Jánosék</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td  className="megjegyzes"></td></tr>
                <tr><td>Kláráék</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td  className="megjegyzes"></td></tr>
                <tr><td>Miklósék</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td  className="megjegyzes"></td></tr>
                <tr><td>Eszterék</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td  className="megjegyzes"></td></tr>
                <tr><td>Katiék</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td  className="megjegyzes"></td></tr>
                <tr><td>Gergőék</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td  className="megjegyzes"></td></tr>
                <tr><td>Mareszék</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td  className="megjegyzes"></td></tr>
                <tr><td>Ritáék</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td  className="megjegyzes"></td></tr>
                <tr><td>Ambrusék</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td  className="megjegyzes"></td></tr>
                <tr><td>Balázsék</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td  className="megjegyzes"></td></tr>
                <tr><td>Boriék</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td  className="megjegyzes"></td></tr>
                <tr><td>Julcssiék</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td  className="megjegyzes"></td></tr>
                <tr><td>Pannáék</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td  className="megjegyzes"></td></tr>
                <tr><td>Marci</td>
                <td>0</td>
                <td></td>
                <td ></td>
                
                <td className="megjegyzes"></td></tr>
                <tr className="osszesito"><td>Hétfői összesítő</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                </tr> </tbody>
        </table>
      </div>
      <h1>Vasárnapi</h1>
      <div className="table-container">
        <table>
          <thead>
            <tr>
            <th></th>
              <th>Főétel </th>
              <th>Leves</th>
              <th>Adagok</th>
              <th className="megjegyzes">Megjegyzés</th>
              
            </tr>
          </thead>
          <tbody>
          <tr><td>2025.07.28</td>
                <td>Rántott hús burgonya</td>
                <td>Fahéjas szilvaleves</td>
                <td>ÖSSZESEN</td>
                
                <td className="megjegyzes"></td>
                </tr>
                <tr><td>Ágiék</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td  className="megjegyzes"></td></tr>
                <tr><td>Lucáék</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td  className="megjegyzes"></td></tr>
                <tr><td>Tamásék</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td  className="megjegyzes"></td></tr>
                <tr><td>Zsófiék</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td  className="megjegyzes"></td></tr>
                <tr><td>Péterék</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td className="megjegyzes"></td></tr>
                <tr><td>Jánosék</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td  className="megjegyzes"></td></tr>
                <tr><td>Kláráék</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td  className="megjegyzes"></td></tr>
                <tr><td>Miklósék</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td  className="megjegyzes"></td></tr>
                <tr><td>Eszterék</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td  className="megjegyzes"></td></tr>
                <tr><td>Katiék</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td  className="megjegyzes"></td></tr>
                <tr><td>Gergőék</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td  className="megjegyzes"></td></tr>
                <tr><td>Mareszék</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td  className="megjegyzes"></td></tr>
                <tr><td>Ritáék</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td  className="megjegyzes"></td></tr>
                <tr><td>Ambrusék</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td  className="megjegyzes"></td></tr>
                <tr><td>Balázsék</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td  className="megjegyzes"></td></tr>
                <tr><td>Boriék</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td  className="megjegyzes"></td></tr>
                <tr><td>Julcssiék</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td  className="megjegyzes"></td></tr>
                <tr><td>Pannáék</td>
                <td>0</td>
                <td></td>
                <td></td>
                <td  className="megjegyzes"></td></tr>
                <tr><td>Marci</td>
                <td>0</td>
                <td></td>
                <td ></td>
                
                <td className="megjegyzes"></td></tr> 
                <tr className="osszesito"><td>Hétfői összesítő</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                </tr>                         </tbody>
        </table>
      </div>
      </div>
      )}
    </div>
    
  );
};

export default Etelek;
