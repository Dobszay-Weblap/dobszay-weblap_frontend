import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { myAxios } from '../../contexts/MyAxios';
import "./Korabbiev.css";

const KorabbiEv = () => {
    const { year } = useParams();
    const [videos, setVideos] = useState([]);
    const [kepek, setKepek] = useState([]);
    const [error, setError] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);

    useEffect(() => {
        const parsedYear = parseInt(year, 10);
        if (isNaN(parsedYear) || parsedYear <= 0) {
            setError('Érvénytelen év');
            return;
        }

        fetchData();
    }, [year]);

    const fetchData = async () => {
        setVideos([]);
        setKepek([]);
        setError(null);

        try {
            const parsedYear = parseInt(year, 10);
            console.log("Lekért év:", parsedYear);
            console.log("Teljes URL:", `http://localhost:8000/api/korabbiev/${parsedYear}`);
            
            const response = await myAxios.get(`http://localhost:8000/api/korabbiev/${parsedYear}`);
            
            console.log("Válasz adatok:", response.data);
            
            if (response.data.error) {
                setError(response.data.error);
            } else {
                setVideos(response.data.videos ?? []);
                setKepek(response.data.images ?? []);
                console.log("Betöltött képek:", response.data.images);
                console.log("Betöltött videók:", response.data.videos);
            }
        } catch (err) {
            console.error('Hiba részletei:', err);
            console.error('Hiba válasz:', err.response);
            console.error('Hiba üzenet:', err.message);
            setError('Hiba történt az adatok lekérésekor: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        setUploading(true);
        setUploadMessage('');

        try {
            const response = await myAxios.post(
                `http://localhost:8000/api/korabbiev/${year}/upload-image`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            setUploadMessage('Kép sikeresen feltöltve!');
            fetchData(); // Frissítjük a listát
        } catch (err) {
            setUploadMessage('Hiba a kép feltöltése során');
            console.error(err);
        } finally {
            setUploading(false);
            e.target.value = ''; // Input reset
        }
    };

    const handleVideoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('video', file);

        setUploading(true);
        setUploadMessage('');

        try {
            const response = await myAxios.post(
                `http://localhost:8000/api/korabbiev/${year}/upload-video`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            setUploadMessage('Videó sikeresen feltöltve!');
            fetchData(); // Frissítjük a listát
        } catch (err) {
            setUploadMessage('Hiba a videó feltöltése során');
            console.error(err);
        } finally {
            setUploading(false);
            e.target.value = ''; // Input reset
        }
    };

    const handleDeleteImage = async (imageUrl) => {
        if (!window.confirm('Biztosan törlöd ezt a képet?')) return;

        try {
            const filepath = imageUrl.split('/').slice(-2).join('/');
            await myAxios.delete(`http://localhost:8000/api/korabbiev/${year}/delete-image`, {
                data: { filepath }
            });
            setUploadMessage('Kép törölve');
            fetchData();
        } catch (err) {
            setUploadMessage('Hiba a törlés során');
            console.error(err);
        }
    };

    const handleDeleteVideo = async (videoUrl) => {
        if (!window.confirm('Biztosan törlöd ezt a videót?')) return;

        try {
            const filepath = videoUrl.split('/').slice(-2).join('/');
            await myAxios.delete(`http://localhost:8000/api/korabbiev/${year}/delete-video`, {
                data: { filepath }
            });
            setUploadMessage('Videó törölve');
            fetchData();
        } catch (err) {
            setUploadMessage('Hiba a törlés során');
            console.error(err);
        }
    };

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="korabbi-ev-container">
            <h1>{year} - Képek és Videók</h1>

            {/* Feltöltési szekció */}
            <div className="upload-section">
                <div className="upload-controls">
                    <div className="upload-item">
                        <label htmlFor="image-upload" className="upload-btn">
                            📷 Kép feltöltése
                        </label>
                        <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploading}
                            style={{ display: 'none' }}
                        />
                    </div>

                    <div className="upload-item">
                        <label htmlFor="video-upload" className="upload-btn">
                            🎥 Videó feltöltése
                        </label>
                        <input
                            id="video-upload"
                            type="file"
                            accept="video/*"
                            onChange={handleVideoUpload}
                            disabled={uploading}
                            style={{ display: 'none' }}
                        />
                    </div>
                </div>

                {uploading && <p className="upload-status">Feltöltés folyamatban...</p>}
                {uploadMessage && <p className="upload-message">{uploadMessage}</p>}
            </div>

            {/* Képek és videók megjelenítése */}
            <div className="media-container">
                {/* Képek szekció */}
                <div className="media-section">
                    <h2>Képek</h2>
                    {kepek.length > 0 ? (
                        <div className="image-gallery">
                            {kepek.map((imageUrl, index) => (
                                <div key={index} className="media-item">
                                    <img src={imageUrl} alt={`Kép ${index}`} />
                                    <button 
                                        className="delete-btn"
                                        onClick={() => handleDeleteImage(imageUrl)}
                                    >
                                        🗑️ Törlés
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>Nincsenek elérhető képek.</p>
                    )}
                </div>

                {/* Videók szekció */}
                <div className="media-section">
                    <h2>Videók</h2>
                    {videos.length > 0 ? (
                        <div className="video-gallery">
                            {videos.map((videoUrl, index) => (
                                <div key={index} className="media-item">
                                    <video controls>
                                        <source src={videoUrl} type="video/mp4" />
                                    </video>
                                    <button 
                                        className="delete-btn"
                                        onClick={() => handleDeleteVideo(videoUrl)}
                                    >
                                        🗑️ Törlés
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>Nincsenek elérhető videók.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default KorabbiEv;