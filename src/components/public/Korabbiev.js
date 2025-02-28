import React, { useState, useEffect } from 'react';
import { myAxios } from '../../contexts/MyAxios';

const KorabbiEv = ({ year }) => {
    const [images, setImages] = useState(null); // Az állapot a képek tárolására
    const [error, setError] = useState(null); // Hibaüzenet tárolás

    useEffect(() => {
        console.log(year);
        
        // Próbáljuk meg konvertálni a year-t számra
        const parsedYear = parseInt(year, 10); // parseInt-et használunk, hogy biztosan számot kapjunk

        // Ellenőrizzük, hogy a parsedYear érvényes szám-e
        const validYear = !isNaN(parsedYear) && parsedYear > 0;

        if (!validYear) {
            setError('Érvénytelen év');
            return; // Ha nem érvényes, kilépünk
        }

        console.log("Küldött év:", parsedYear); // Logoljuk az évet a konzolra, hogy lásd, mi történik

        // Az adatok lekérése
        const fetchData = async () => {
            try {
                const response = await myAxios.get(`http://localhost:8000/api/korabbiev/${parsedYear}`);
                if (response.data.images) {
                    setImages(response.data.images); // A képeket tároljuk az állapotba
                } else {
                    setError("Images not found"); // Ha nincs 'images' mező, hiba
                }
            } catch (err) {
                setError('Hiba történt az adatok lekérésekor');
                console.error(err);
            }
        };

        fetchData(); // Lekérjük az adatokat, ha az év érvényes
    }, [year]); // Ha a 'year' változik, újra lefut

    // Ha van hiba, azt megjelenítjük
    if (error) {
        return <div>{error}</div>;
    }

    // Ha nincsenek képek
    if (!images) {
        return <div>Loading...</div>;
    }

    // Ha vannak képek, megjelenítjük őket
    return (
        <div>
            <h2>Képek a {year} évből</h2>
            <div className="image-gallery">
                {images.map((image, index) => (
                    <div key={index} className="media-item">
                        {/* Ha a fájl típus videó, akkor videót jelenítünk meg */}
                        {image.endsWith('.mp4') ? (
                            <video width="320" height="240" controls>
                                <source src={image} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            // Ha nem videó, akkor képet jelenítünk meg
                            <img src={image} alt={`Media ${index + 1}`} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default KorabbiEv;
