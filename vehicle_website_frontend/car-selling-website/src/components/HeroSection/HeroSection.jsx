import "./HeroSection.css";

function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Find Your Dream Car</h1>

        <p>
          Buy certified used cars at the best price.
        </p>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search Brand, Model..."
          />
          <button>Search</button>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;