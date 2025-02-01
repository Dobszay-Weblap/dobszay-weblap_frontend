import React, { useEffect, useState } from "react";
import "./Hazak.css";

const Hazak = () => {
  const [foglaltsag, setFoglaltsag] = useState({});

  useEffect(() => {
    // Itt kell lekérni a backendről a foglaltsági adatokat
    fetch("api/foglaltsag")
      .then((res) => res.json())
      .then((data) => setFoglaltsag(data))
      .catch((err) => console.error("Hiba a foglaltság lekérésekor:", err));
  }, []);

  // Segédfüggvény a foglalt szobákhoz
  const getClassName = (alapClass, nev) => 
    foglaltsag[nev] ? `${alapClass} foglalt` : alapClass;

  return (
    <div className="keret">
      <div className="foglalo-wrapper">
        <aside>
          <div className="fout">Iskola utca</div>
        </aside>

        <article className="fahazak">
          <div className={getClassName("f1", "Faház 1")}>1. Faház</div>
          <div className={getClassName("f2", "Faház 2")}>2. Faház</div>
          <div className={getClassName("f3", "Faház 3")}>3. Faház</div>
          <div className={getClassName("f4", "Faház 4")}>4. Faház</div>
        </article>

        <article className="haz">
          <div className={getClassName("em1", "Emelet 1")}>Emelet 1</div>
          <div className={getClassName("em2", "Emelet 2")}>Emelet 2</div>
          <div className={getClassName("em3", "Emelet 3")}>Emelet 3</div>
          <div className={getClassName("em4", "Emelet 4")}>Emelet 4</div>
          <div className={getClassName("em5", "Emelet 5")}>Emelet 5</div>
          <div className={getClassName("em6", "Emelet 6")}>Emelet 6</div>
          <div className={getClassName("em7", "Emelet 7")}>Emelet 7</div>
          <div className={getClassName("em8", "Emelet 8")}>Emelet 8</div>
          <div className={getClassName("fszt8", "Fszt 8")}>Fszt 8.</div>
          <div className={getClassName("fszt7", "Fszt 7")}>Fszt 7.</div>
          <div className={getClassName("fszt6", "Fszt 6")}>Fszt 6.</div>
          <div className={getClassName("fszt5", "Fszt 5")}>Fszt 5.</div>
          <div className={getClassName("fszt4", "Fszt 4")}>Fszt 4.</div>
          <div className={getClassName("fszt3", "Fszt 3")}>Fszt 3.</div>
          <div className={getClassName("fszt2", "Fszt 2")}>Fszt 2.</div>
          <div className={getClassName("fszt1", "Fszt 1")}>Fszt 1.</div>
        </article>

        <aside>
          <div className="fout">Szigeti József utca</div>
        </aside>
      </div>
    </div>
  );
};

export default Hazak;
