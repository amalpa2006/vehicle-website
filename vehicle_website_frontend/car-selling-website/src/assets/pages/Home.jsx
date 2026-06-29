import Header from "../../components/Header/Header";
import HeroSection from "../../components/HeroSection/HeroSection";
import Categories from "../../components/Categories/Categories";
import FeaturedCars from "../../components/FeaturedCars/FeaturedCars";
import WhyChoooseUs from "../../components/WhyChoooseUs/WhyChoooseUs";
import FAQ from "../../components/Categories/FAQ/FAQ";
import Footer from "../../components/Footer/Footer";

function Home() {
  return (
    <>
      {/* Header + Hero */}
      <Header />
      <HeroSection />

      {/* Content section */}
      <Categories />
      <FeaturedCars />
      <WhyChoooseUs />

      {/* FAQ + Footer */}
      <FAQ />
      <Footer />
    </>
  );
}

export default Home;

