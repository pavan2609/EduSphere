import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="app-header">
      <div>
        <h3>Dashboard</h3>
      </div>

      <div className="header-user">
        <div>
          <div className="header-user-name">
            {user.name}
          </div>

          <div className="header-user-role">
            {user.role}
          </div>
        </div>

        <button
          type="button"
          className="btn-secondary"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
