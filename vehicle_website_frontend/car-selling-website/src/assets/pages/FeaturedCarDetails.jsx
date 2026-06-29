import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";

function FeaturedCarDetails() {
  const { carName } = useParams();

  const carList = useMemo(
    () => [
      {
        name: "Tata Nexon EV",
        price: "₹15 Lakh",
        image: new URL("../../../assets/images/nexon ev.jpg", import.meta.url).href,
        details: "Electric performance with smooth driving and smart safety features.",
      },
      {
        name: "Honda City",
        price: "₹10 Lakh",
        image: new URL("../../../assets/images/city.jpg", import.meta.url).href,
        details: "Comfort, space, and efficient mileage for everyday commuting.",
      },
      {
        name: "Hyundai Creta",
        price: "₹12 Lakh",
        image: new URL("../../../assets/images/Creta.jpg", import.meta.url).href,
        details: "Bold design, premium comfort, and confidence on every drive.",
      },
    ],
    []
  );

  const decodedName = decodeURIComponent(carName ?? "");
  const car = carList.find((c) => c.name === decodedName);

  const [showBookForm, setShowBookForm] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    city: "",
    preferredDate: "",
    preferredTime: "",
  });
  const [submittedMsg, setSubmittedMsg] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // No backend: just show confirmation.
    setSubmittedMsg(
      `Booking request received! We'll contact ${form.fullName || "you"} soon.`
    );
    setShowBookForm(false);
    setForm({
      fullName: "",
      phone: "",
      email: "",
      city: "",
      preferredDate: "",
      preferredTime: "",
    });
  };

  if (!car) {
    return (
      <section style={{ padding: 48, color: "#fff" }}>
        <h2 style={{ margin: "0 0 12px" }}>Car details not found</h2>
        <Link to="/" style={{ color: "#fff", textDecoration: "underline" }}>
          Back to Home
        </Link>
      </section>
    );
  }

  return (
    <section className="car-details" style={{ padding: 48, color: "#fff" }}>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <div style={{ marginBottom: 18 }}>
          <Link to="/" style={{ color: "#fff", textDecoration: "underline" }}>
            ← Back to Featured Cars
          </Link>
        </div>

        <h2 style={{ fontSize: 36, margin: "0 0 10px" }}>{car.name}</h2>
        <p style={{ margin: "0 0 18px", opacity: 0.9, fontWeight: 800 }}>{car.price}</p>

        <img
          src={car.image}
          alt={car.name}
          style={{
            width: "100%",
            maxHeight: 420,
            objectFit: "cover",
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        />

        <p style={{ marginTop: 18, lineHeight: 1.7, opacity: 0.9 }}>{car.details}</p>

        {/* Book Now */}
        <div style={{ marginTop: 26 }}>
          <button
            type="button"
            onClick={() => {
              setSubmittedMsg("");
              setShowBookForm((v) => !v);
            }}
            style={{
              cursor: "pointer",
              background: "linear-gradient(135deg, #6b3f2a, #9a5a3a)",
              color: "#ffffff",
              fontSize: 16,
              fontWeight: 800,
              padding: "12px 18px",
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 10px 22px rgba(0, 0, 0, 0.2)",
            }}
          >
            {showBookForm ? "Close Booking" : "Book Now"}
          </button>

          {submittedMsg ? (
            <p style={{ marginTop: 12, fontWeight: 800, opacity: 0.95 }}>{submittedMsg}</p>
          ) : null}
        </div>

        {showBookForm ? (
          <form onSubmit={onSubmit} style={{ marginTop: 18 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 14,
                alignItems: "start",
              }}
            >
              <label style={{ textAlign: "left" }}>
                <span style={{ display: "block", marginBottom: 6, fontWeight: 800 }}>
                  Full Name
                </span>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={onChange}
                  required
                  placeholder="Enter your name"
                  style={{
                    width: "100%",
                    padding: "12px 12px",
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.18)",
                    background: "rgba(20,20,20,0.35)",
                    color: "#fff",
                    outline: "none",
                  }}
                />
              </label>

              <label style={{ textAlign: "left" }}>
                <span style={{ display: "block", marginBottom: 6, fontWeight: 800 }}>
                  Phone
                </span>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={onChange}
                  required
                  placeholder="Enter phone number"
                  style={{
                    width: "100%",
                    padding: "12px 12px",
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.18)",
                    background: "rgba(20,20,20,0.35)",
                    color: "#fff",
                    outline: "none",
                  }}
                />
              </label>

              <label style={{ textAlign: "left" }}>
                <span style={{ display: "block", marginBottom: 6, fontWeight: 800 }}>
                  Email (optional)
                </span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="Enter email"
                  style={{
                    width: "100%",
                    padding: "12px 12px",
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.18)",
                    background: "rgba(20,20,20,0.35)",
                    color: "#fff",
                    outline: "none",
                  }}
                />
              </label>

              <label style={{ textAlign: "left" }}>
                <span style={{ display: "block", marginBottom: 6, fontWeight: 800 }}>
                  City (optional)
                </span>
                <input
                  name="city"
                  value={form.city}
                  onChange={onChange}
                  placeholder="Enter city"
                  style={{
                    width: "100%",
                    padding: "12px 12px",
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.18)",
                    background: "rgba(20,20,20,0.35)",
                    color: "#fff",
                    outline: "none",
                  }}
                />
              </label>

              <label style={{ textAlign: "left" }}>
                <span style={{ display: "block", marginBottom: 6, fontWeight: 800 }}>
                  Preferred Date
                </span>
                <input
                  type="date"
                  name="preferredDate"
                  value={form.preferredDate}
                  onChange={onChange}
                  style={{
                    width: "100%",
                    padding: "12px 12px",
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.18)",
                    background: "rgba(20,20,20,0.35)",
                    color: "#fff",
                    outline: "none",
                  }}
                />
              </label>

              <label style={{ textAlign: "left" }}>
                <span style={{ display: "block", marginBottom: 6, fontWeight: 800 }}>
                  Preferred Time
                </span>
                <input
                  type="time"
                  name="preferredTime"
                  value={form.preferredTime}
                  onChange={onChange}
                  style={{
                    width: "100%",
                    padding: "12px 12px",
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.18)",
                    background: "rgba(20,20,20,0.35)",
                    color: "#fff",
                    outline: "none",
                  }}
                />
              </label>
            </div>

            <div style={{ marginTop: 16, textAlign: "left" }}>
              <button
                type="submit"
                style={{
                  cursor: "pointer",
                  background: "linear-gradient(135deg, #6b3f2a, #9a5a3a)",
                  color: "#ffffff",
                  fontSize: 16,
                  fontWeight: 900,
                  padding: "12px 18px",
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,0.12)",
                  boxShadow: "0 10px 22px rgba(0, 0, 0, 0.2)",
                }}
              >
                Submit Booking Request
              </button>

              <p style={{ marginTop: 10, opacity: 0.85, fontWeight: 700 }}>
                Note: This demo form stores nothing (no backend).
              </p>
            </div>
          </form>
        ) : null}
      </div>
    </section>
  );
}

export default FeaturedCarDetails;
