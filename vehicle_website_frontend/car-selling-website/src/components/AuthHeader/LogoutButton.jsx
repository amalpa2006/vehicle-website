import { useNavigate } from "react-router-dom";

function LogoutButton() {
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  return (
    <button className="loginButtonText" onClick={onLogout} type="button">
      Logout
    </button>
  );
}

export default LogoutButton;

