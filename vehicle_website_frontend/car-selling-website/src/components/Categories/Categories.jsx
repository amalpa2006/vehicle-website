import "./Categories.css";
import suvImg from "../../../../assets/images/suv.jpg";
import sedanImg from "../../../../assets/images/sedan.jpg";
import hatchbackImg from "../../../../assets/images/hatchback.jpg";
import luxuryImg from "../../../../assets/images/hero-car.jpg";

function Categories() {
  const categories = [
    { name: "SUV", image: suvImg },
    { name: "Sedan", image: sedanImg },
    { name: "Hatchback", image: hatchbackImg },
    { name: "Luxury", image: luxuryImg },
  ];

  return (
    <section className="categories" aria-label="Browse by category">
      <div className="categories-inner">
        <h2>Browse By Category</h2>

        <div className="category-grid">
          {categories.map((item) => (
            <div className="card" key={item.name}>
              <img src={item.image} alt={item.name} />
              <div className="card-title">{item.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Categories;