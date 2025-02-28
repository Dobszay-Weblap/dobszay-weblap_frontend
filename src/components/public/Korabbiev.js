import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { myAxios } from '../../contexts/MyAxios';

const KorabbiEv = () => {
    const { year } = useParams(); // Lekérjük az évet a URL-ből
    const [images, setImages] = useState([]);
    const [videos, setVideos] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log(year);
        
        // Próbáljuk meg konvertálni a year-t számra


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
                    setError(response.data.error);
                } else {
                    setImages(response.data.images ?? []);  
                    setVideos(response.data.videos ?? []);  
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
            <h2>Média a {year} évből</h2>
    
            {/* Képek megjelenítése */}
            {images.length > 0 && (
                <div>
                    <h3>Képek</h3>
                    <div className="image-gallery">
                        {images.map((image, index) => (
                            <div key={index} className="media-item">
                                <img key={index} src={`/kep/${image}`} alt={`Kép ${index + 1}`} className="media-item" />
                            </div>
                        ))}
                    </div>
                </div>
            )}
    
            {/* Videók megjelenítése */}
            {videos.length > 0 && (
                <div>
                    <h3>Videók</h3>
                    <div className="video-gallery">
                        {videos.map((video, index) => (
                            <div key={index} className="media-item">
                                <video width="320" height="240" controls>
                                    <source src={`/storage/${video}`} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
    
};

export default KorabbiEv;
