import "./Header.css";
import { Link } from "react-router-dom";
import LogoutButton from "../AuthHeader/LogoutButton";

function Header() {
  const isLoggedIn = !!localStorage.getItem("accessToken");

  return (
    <header className="header">
      <Link to="/" className="logo">CarMart</Link>

      <nav>
        <ul>
          <li>Buy Car</li>
          <li>Sell Car</li>
          <li>Services</li>
          <li>FAQ</li>
          {isLoggedIn && (
            <li>
              <Link to="/admin" className="adminNavLink">Admin</Link>
            </li>
          )}
        </ul>
      </nav>

      <div className="authLinks">
        {isLoggedIn ? (
          <LogoutButton />
        ) : (
          <Link className="loginLink" to="/login">
            <span className="loginButtonText">Login</span>
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;

