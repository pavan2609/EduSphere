import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <header>
      <div>
        <h3>Dashboard</h3>
      </div>

      <div>
        <span>
          {user.name} ({user.role})
        </span>

        <button onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;