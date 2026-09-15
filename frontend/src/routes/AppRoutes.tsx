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

import CreateCourse from "../pages/instructor/CreateCourse";
import InstructorCourses from "../pages/instructor/InstructorCourses";
import CourseEditor from "../pages/instructor/CourseEditor";
import StudentCourses from "../pages/student/StudentCourses";
import StudentCourseDetails from "../pages/student/StudentCourseDetails";
const AdminUsers = () => {
    return <h1>User Management</h1>;
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

                        <Route
                            path="/instructor/courses/create"
                            element={<CreateCourse />}
                        />
                        <Route
                            path="/instructor/courses/:courseId"
                            element={<CourseEditor />}
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
                            path="/student/courses/:courseId"
                            element={<StudentCourseDetails />}
                        />
                        <Route
                            path="/student/my-courses"
                            element={
                                <div>
                                    My Learning
                                </div>
                            }
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