import "./Login.css";
import Header from "../../components/Header/Header";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const navigate = useNavigate();

  const API_BASE = "http://127.0.0.1:8000/";
  const LOGIN_URL = `${API_BASE}api/auth/login`.replace(/\/+$/, "");


  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(LOGIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const detail = data?.detail || data?.message || "Login failed";
        setMessage(String(detail));
        return;
      }

      // Success: show response message and optionally store token.
      const successMsg = data?.message || "Login successful";
      setMessage(successMsg);

      if (data?.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
      }
      if (data?.user?.email) {
        localStorage.setItem("userEmail", data.user.email);
      }

      // Redirect to home after successful login
      navigate("/");


    } catch (err) {
      setMessage("Network error: unable to reach login service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main className="loginPage">
        <section className="loginCard" aria-label="Login form">
          <h1 className="loginTitle">Login</h1>
          <p className="loginSubtitle">Welcome back! Sign in to continue.</p>

          <form className="loginForm" onSubmit={onSubmit}>
            <label className="field">
              <span className="labelText">Email</span>
              <input
                className="input"
                type="email"
                name="email"
                placeholder="Enter your email"
                required
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              />
            </label>

            <label className="field">
              <span className="labelText">Password</span>
              <input
                className="input"
                type="password"
                name="password"
                placeholder="Enter your password"
                required
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              />
            </label>

            <button className="loginButton" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>

            {message ? (
              <p style={{ marginTop: 10, color: "#fff", fontWeight: 800, opacity: 0.95 }}>
                {message}
              </p>
            ) : null}

            <div className="loginMeta">
              <a className="metaLink" href="#">
                Forgot password?
              </a>
            </div>

            <div className="registerPrompt">
              <span className="registerText">Create a new account not registered?</span>
              <Link className="registerLink" to="/register">
                Register
              </Link>
            </div>
          </form>
        </section>
      </main>
    </>
  );
}


export default Login;

