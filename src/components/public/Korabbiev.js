import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { myAxios } from '../../contexts/MyAxios';

const KorabbiEv = () => {
    const { year } = useParams(); // Lekérjük az évet a URL-ből
    const [images, setImages] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const parsedYear = parseInt(year, 10);  // Az évet számra konvertáljuk
        console.log("Lekért év:", parsedYear);  // Logoljuk, hogy mi történik
    
        const validYear = !isNaN(parsedYear) && parsedYear > 0;  // Ellenőrizzük, hogy érvényes év-e
    
        if (!validYear) {
            setError('Érvénytelen év');
            return;
        }
    
        const fetchData = async () => {
            try {
                const response = await myAxios.get(`http://localhost:8000/api/korabbiev/${parsedYear}`);
                console.log("API válasz:", response.data);  // Logoljuk a választ
                if (response.data.error) {
                    setError(response.data.error); // Hibát adunk vissza, ha nincs adat
                } else {
                    setImages(response.data.images);  // Ha van adat, tároljuk a képeket
                }
            } catch (err) {
                setError('Hiba történt az adatok lekérésekor');
                console.error(err);
            }
        };
    
        fetchData();
    }, [year]);  // Az év változására újrafuttatjuk a lekérdezést
     // Az év változására újrafuttatjuk a lekérdezést

    if (error) {
        return <div>{error}</div>;
    }

    if (!images) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Képek a {year} évből</h2>
            <div className="image-gallery">
                {images.map((image, index) => (
                    <div key={index} className="media-item">
                        {image.endsWith('.mp4') ? (
                            <video width="320" height="240" controls>
                                <source src={`/video/${image}`} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <img src={`/kep/${image}`} alt={`Media ${index + 1}`} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default KorabbiEv;
