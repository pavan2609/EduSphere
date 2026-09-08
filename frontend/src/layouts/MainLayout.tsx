import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
const MainLayout = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div>
      <Sidebar />

      <div>
        <Header />

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;