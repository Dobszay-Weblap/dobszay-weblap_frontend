import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { myAxios } from '../../contexts/MyAxios';
import Videok from './Videok';
import Kepek from './Kepek';
import "./Korabbiev.css";

const KorabbiEv = () => {
    const { year } = useParams();
    const [videos, setVideos] = useState([]);
    const [kepek, setKepek] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const parsedYear = parseInt(year, 10);
        if (isNaN(parsedYear) || parsedYear <= 0) {
            setError('Érvénytelen év');
            return;
        }

        setVideos([]); // Régi adatok törlése váltáskor
        setKepek([]);
        setError(null);

        const fetchData = async () => {
            try {
                console.log("Lekért év:", parsedYear); // Debugging log
                const response = await myAxios.get(`http://localhost:8000/api/korabbiev/${parsedYear}`);
                if (response.data.error) {
                    setError(response.data.error);
                } else {
                    setVideos(response.data.videos ?? []);
                    setKepek(response.data.images ?? []);
                }
            } catch (err) {
                setError('Hiba történt az adatok lekérésekor');
            }
        };

        fetchData();
    }, [year]);

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>{year} - Képek és Videók</h1>
            <div style={{ display: 'flex', gap: '20px' }}>
                <Kepek kepek={kepek} />
                <Videok videos={videos} />
            </div>
        </div>
    );
};

export default KorabbiEv;
