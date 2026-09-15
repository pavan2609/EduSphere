import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getMyCourses } from "../../services/courseService";
import type { CourseResponse } from "../../services/courseService";

const InstructorCourses = () => {
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCourses = async () => {
    try {
      setLoading(true);

      const data = await getMyCourses();

      setCourses(data);
    } catch (error) {
      console.error(error);
      setError("Failed to load courses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-state">
          Loading courses...
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

      <div className="page-header">
        <div>
          <h1>My Courses</h1>
          <p>
            Create and manage your learning courses.
          </p>
        </div>

        <Link
          to="/instructor/courses/create"
          className="btn-primary"
        >
          + Create Course
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="empty-state">
          <h2>No Courses Yet</h2>

          <p>
            You haven't created any courses yet.
          </p>

          <Link
            to="/instructor/courses/create"
            className="btn-primary"
          >
            Create Your First Course
          </Link>
        </div>
      ) : (
        <div className="grid grid-3">

          {courses.map((course) => (
            <div
              key={course.id}
              className="course-card"
            >

              <div className="course-card-header">
                <h2>{course.title}</h2>

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

              <div className="course-card-footer">
                <Link
                  to={`/instructor/courses/${course.id}`}
                  className="btn-primary"
                >
                  Manage Course
                </Link>
              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default InstructorCourses;
