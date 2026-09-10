import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getMyCourses } from "../../services/courseService";
import type { CourseResponse } from "../../services/courseService";
const  InstructorCourses = () => {
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
    return <p>Loading courses...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <div>
        <h1>My Courses</h1>

        <Link to="/instructor/courses/create">
          Create Course
        </Link>
      </div>

      {courses.length === 0 ? (
        <p>You haven't created any courses yet.</p>
      ) : (
        <div>
          {courses.map((course) => (
            <div key={course.id}>
              <h2>{course.title}</h2>

              <p>{course.description}</p>

              <p>
                Status: {course.status}
              </p>

              <Link
                to={`/instructor/courses/${course.id}`}
              >
                Manage Course
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstructorCourses;