import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "../pages/auth/login";
import Register from "../pages/auth/register";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import StudentDashboard from "../pages/student/StudentDashboard";
import InstructorDashboard from "../pages/instructor/InstructorDashboard";

const AdminUsers = () => {
  return <h1>User Management</h1>;
};

const InstructorCourses = () => {
  return <h1>My Courses</h1>;
};

const StudentCourses = () => {
  return <h1>Course Catalog</h1>;
};

const StudentMyCourses = () => {
  return <h1>My Learning</h1>;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />


        {/* Protected Application */}

        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route element={<MainLayout />}>

            <Route
              path="/admin/dashboard"
              element={<AdminDashboard />}
            />

            <Route
              path="/admin/users"
              element={<AdminUsers />}
            />

          </Route>
        </Route>


        <Route element={<ProtectedRoute allowedRoles={["INSTRUCTOR"]} />}>
          <Route element={<MainLayout />}>

            <Route
              path="/instructor/dashboard"
              element={<InstructorDashboard />}
            />

            <Route
              path="/instructor/courses"
              element={<InstructorCourses />}
            />

          </Route>
        </Route>


        <Route element={<ProtectedRoute allowedRoles={["STUDENT"]} />}>
          <Route element={<MainLayout />}>

            <Route
              path="/student/dashboard"
              element={<StudentDashboard />}
            />

            <Route
              path="/student/courses"
              element={<StudentCourses />}
            />

            <Route
              path="/student/my-courses"
              element={<StudentMyCourses />}
            />

          </Route>
        </Route>


        {/* Default */}

        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;