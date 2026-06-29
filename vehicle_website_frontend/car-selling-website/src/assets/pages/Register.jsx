import "./Register.css";
import Header from "../../components/Header/Header";

function Register() {
  return (
    <>
      <Header />

      <main className="registerPage">
        <section className="registerCard" aria-label="Register form">
          <h1 className="registerTitle">Register</h1>
          <p className="registerSubtitle">Create your account to continue.</p>

          <form
            className="registerForm"
            onSubmit={(e) => {
              e.preventDefault();
              // Demo-only: prevent page reload.
              // If you wire backend later, replace this handler.
              console.log("Register submitted");
            }}
          >

            <div className="grid2">
              <label className="field">
                <span className="labelText">First Name</span>
                <input
                  className="input"
                  type="text"
                  name="firstName"
                  placeholder="Enter first name"
                  required
                />
              </label>

              <label className="field">
                <span className="labelText">Second Name</span>
                <input
                  className="input"
                  type="text"
                  name="secondName"
                  placeholder="Enter second name"
                  required
                />
              </label>
            </div>

            <label className="field">
              <span className="labelText">Date of Birth</span>
              <input
                className="input"
                type="date"
                name="dateOfBirth"
                required
              />
            </label>

            <label className="field">
              <span className="labelText">Address</span>
              <input
                className="input"
                type="text"
                name="address"
                placeholder="Enter address"
                required
              />
            </label>

            <div className="grid2">
              <label className="field">
                <span className="labelText">Gender</span>
                <select className="input" name="gender" required>
                  <option value="" disabled>
                    Select gender
                  </option>

                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </label>

              <label className="field">
                <span className="labelText">Email</span>
                <input
                  className="input"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                />
              </label>
            </div>

            <label className="field">
              <span className="labelText">Password</span>
              <input
                className="input"
                type="password"
                name="password"
                placeholder="Create a password"
                required
              />
            </label>

            <button className="registerButton" type="submit">
              Create Account
            </button>

            <div className="registerMeta">
              <a className="metaLink" href="#">
                By continuing, you agree to Terms
              </a>
            </div>
          </form>
        </section>
      </main>
    </>
  );
}

export default Register;


