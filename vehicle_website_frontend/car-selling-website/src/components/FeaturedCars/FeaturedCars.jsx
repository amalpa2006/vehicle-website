import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import cretaImg from "../../../../assets/images/Creta.jpg";
import cityImg from "../../../../assets/images/city.jpg";
import nexonEvImg from "../../../../assets/images/nexon ev.jpg";

import "./FeaturedCars.css";

const imageMap = {
  nexonEvImg,
  cityImg,
  cretaImg,
};

function FeaturedCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const API_BASE = "http://127.0.0.1:8000";

    fetch(`${API_BASE}/api/vehicles`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setCars(data.vehicles || []);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <section className="featured-cars">
        <h2>Featured Cars</h2>
        <p style={{ textAlign: "center", opacity: 0.7 }}>Loading vehicles...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="featured-cars">
        <h2>Featured Cars</h2>
        <p style={{ textAlign: "center", opacity: 0.7, color: "#ff6b6b" }}>
          Unable to load vehicles. Please try again later.
        </p>
      </section>
    );
  }

  if (cars.length === 0) {
    return (
      <section className="featured-cars">
        <h2>Featured Cars</h2>
        <p style={{ textAlign: "center", opacity: 0.7 }}>
          No vehicles available at the moment.
        </p>
      </section>
    );
  }

  return (
    <section className="featured-cars">
      <h2>Featured Cars</h2>

      <div className="car-grid">
        {cars.map((car) => (
          <div className="car-card" key={car.id || car.name}>
            <h3>{car.name}</h3>
            <img
              src={imageMap[car.image] || cretaImg}
              alt={car.name}
              className="car-image"
            />
            <p>{car.price}</p>
            <Link
              className="details-link"
              to={`/cars/${encodeURIComponent(car.name)}`}
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturedCars;