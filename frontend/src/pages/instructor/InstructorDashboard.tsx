import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getMyCourses } from "../../services/courseService";
import type { CourseResponse } from "../../services/courseService";

const InstructorDashboard = () => {
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyCourses();

      setCourses(data);
    } catch (error) {
      console.error(error);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const totalCourses = courses.length;

  const publishedCourses = courses.filter(
    (course) => course.status === "PUBLISHED"
  ).length;

  const draftCourses = courses.filter(
    (course) => course.status !== "PUBLISHED"
  ).length;

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-state">
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <p className="error-message">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="page-container">

      {/* =========================
          Dashboard Header
      ========================= */}

      <div className="page-header">
        <div>
          <h1>Instructor Dashboard</h1>

          <p>
            Manage your courses, quizzes and student progress.
          </p>
        </div>

        <Link
          to="/instructor/courses/create"
          className="btn-primary"
        >
          + Create Course
        </Link>
      </div>

      {/* =========================
          Course Statistics
      ========================= */}

      <div className="grid grid-3">

        <div className="stat-card">
          <div className="stat-card-title">
            Total Courses
          </div>

          <div className="stat-card-value">
            {totalCourses}
          </div>

          <p>
            Courses you have created
          </p>
        </div>

        <div className="stat-card">
          <div className="stat-card-title">
            Published Courses
          </div>

          <div className="stat-card-value">
            {publishedCourses}
          </div>

          <p>
            Courses available to students
          </p>
        </div>

        <div className="stat-card">
          <div className="stat-card-title">
            Draft Courses
          </div>

          <div className="stat-card-value">
            {draftCourses}
          </div>

          <p>
            Courses still being prepared
          </p>
        </div>

      </div>

      {/* =========================
          Quick Actions
      ========================= */}

      <div className="grid grid-2">

        <div className="card">
          <h2>Course Management</h2>

          <p>
            Create, edit and publish your courses.
            Add modules, lessons and learning materials.
          </p>

          <Link
            to="/instructor/courses"
            className="btn-primary"
          >
            Manage My Courses
          </Link>
        </div>

        <div className="card">
          <h2>Learning Content</h2>

          <p>
            Build structured learning content by
            organizing modules, lessons and files.
          </p>

          <Link
            to="/instructor/courses"
            className="btn-secondary"
          >
            Manage Content
          </Link>
        </div>

      </div>

      {/* =========================
          Recent Courses
      ========================= */}

      <section className="course-editor-section">

        <div className="course-editor-section-header">
          <div>
            <h2>My Recent Courses</h2>

            <p>
              Your courses currently available in EduSphere.
            </p>
          </div>

          <Link
            to="/instructor/courses"
            className="btn-secondary"
          >
            View All
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="empty-state">

            <h3>
              No Courses Yet
            </h3>

            <p>
              Start by creating your first course.
            </p>

            <Link
              to="/instructor/courses/create"
              className="btn-primary"
            >
              Create Course
            </Link>

          </div>
        ) : (
          <div className="grid grid-3">

            {courses.slice(0, 3).map((course) => (
              <div
                key={course.id}
                className="course-card"
              >

                <div className="course-card-header">

                  <h2>
                    {course.title}
                  </h2>

                  <span
                    className={`status-badge ${
                      course.status === "PUBLISHED"
                        ? "status-published"
                        : "status-draft"
                    }`}
                  >
                    {course.status}
                  </span>

                </div>

                <p className="course-card-description">
                  {course.description}
                </p>

                <Link
                  to={`/instructor/courses/${course.id}`}
                  className="btn-primary"
                >
                  Manage Course
                </Link>

              </div>
            ))}

          </div>
        )}

      </section>

    </div>
  );
};

export default InstructorDashboard;
