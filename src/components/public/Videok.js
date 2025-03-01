import React, { useEffect, useState } from 'react';

const Video = () => {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8000/api/videos")  // A backend API meghívása
            .then((res) => res.json())
            .then((data) => setVideos(data))
            .catch((err) => console.error("Hiba a videók betöltésekor:", err));
    }, []);

    return (
        <div>
        <h1>Videók</h1>
    <div className='media-gallery'>
        
            {videos.length > 0 ? (
                videos.map((videoUrl, index) => (
                    <video key={index} controls width="400">
                        <source src={videoUrl} type="video/mp4" />
                    </video>
                ))
            ) : (
                <p>Nincsenek elérhető videók.</p>
            )}
        </div>
        </div>
    );
}

export default Video;
