import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        EduSphere
      </div>

      <nav className="sidebar-nav">

        {user.role === "ADMIN" && (
          <>
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                `sidebar-link${isActive ? " active" : ""}`
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `sidebar-link${isActive ? " active" : ""}`
              }
            >
              Users
            </NavLink>
          </>
        )}

        {user.role === "INSTRUCTOR" && (
          <>
            <NavLink
              to="/instructor/dashboard"
              className={({ isActive }) =>
                `sidebar-link${isActive ? " active" : ""}`
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/instructor/courses"
              className={({ isActive }) =>
                `sidebar-link${isActive ? " active" : ""}`
              }
            >
              My Courses
            </NavLink>
          </>
        )}

        {user.role === "STUDENT" && (
          <>
            <NavLink
              to="/student/dashboard"
              className={({ isActive }) =>
                `sidebar-link${isActive ? " active" : ""}`
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/student/courses"
              className={({ isActive }) =>
                `sidebar-link${isActive ? " active" : ""}`
              }
            >
              Courses
            </NavLink>

            <NavLink
              to="/student/my-courses"
              className={({ isActive }) =>
                `sidebar-link${isActive ? " active" : ""}`
              }
            >
              My Learning
            </NavLink>
          </>
        )}

      </nav>
    </aside>
  );
};

export default Sidebar;
