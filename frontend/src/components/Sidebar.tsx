import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <aside>
      <h2>EduSphere</h2>

      <nav>
        {user.role === "ADMIN" && (
          <>
            <Link to="/admin/dashboard">Dashboard</Link>
            <Link to="/admin/users">Users</Link>
          </>
        )}

        {user.role === "INSTRUCTOR" && (
          <>
            <Link to="/instructor/dashboard">Dashboard</Link>
            <Link to="/instructor/courses">My Courses</Link>
          </>
        )}

        {user.role === "STUDENT" && (
          <>
            <Link to="/student/dashboard">Dashboard</Link>
            <Link to="/student/courses">Courses</Link>
            <Link to="/student/my-courses">My Learning</Link>
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;