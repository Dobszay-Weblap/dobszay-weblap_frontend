import React, { useEffect, useState } from 'react'; 

const Kepek = () => {
    const [kepek, setKepek] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/images"); // A backend API meghívása
                const data = await response.json();
                setKepek(data);
            } catch (err) {
                setError("Hiba a képek betöltésekor");
            }
        };

        fetchImages();
    }, []);

    return (
        <div>
            <h1>Képek</h1>
            {error ? (
                <p>{error}</p>
            ) : kepek.length > 0 ? (
                <div className='image-gallery'>
                    {kepek.map((imageUrl, index) => (
                        <img key={index} src={imageUrl} alt={`Kép ${index}`} width="400" height="500" />
                    ))}
                </div>
            ) : (
                <p>Nincsenek elérhető képek.</p>
            )}
        </div>
    );
}

export default Kepek;
