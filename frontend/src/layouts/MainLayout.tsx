import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const MainLayout = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <>
      <Sidebar />
      <Header />

      <main className="main-content">
        <div className="main-content-inner">
          <Outlet />
        </div>
      </main>
    </>
  );
};

export default MainLayout;

