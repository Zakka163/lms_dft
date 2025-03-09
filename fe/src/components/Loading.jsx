import { useEffect, useState } from "react";
import loading1 from "../assets/loading1.png";
import loading2 from '../assets/loading2.png';
import loading3 from '../assets/loading3.png';
import loading4 from '../assets/loading4.png';

const images = [loading1, loading2, loading3, loading4];
const LoadingSpinner = () => {
    const [currentImage, setCurrentImage] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setCurrentImage((prev) => (prev + 1) % images.length);
                setFade(true);
            }, 500);
        }, 120);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="d-flex flex-column align-items-center gap-3">

            <img
                src={images[currentImage]}
                alt="Loading"
                className={`img-fluid transition-opacity ${fade ? 'opacity-100' : 'opacity-0'}`}
                style={{ width: "3rem", height: "3rem", transition: "opacity 0.2s ease-in-out" }}
            />
            <p className="text-secondary">Loading</p>
        </div>
    );
};

export default LoadingSpinner;