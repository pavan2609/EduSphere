import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getStudentCourses,
} from "../../services/studentCourseService";

import type {
  StudentCourse,
} from "../../services/studentCourseService";

const StudentCourses = () => {
  const [courses, setCourses] = useState<StudentCourse[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [searchInput, setSearchInput] = useState("");

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(0);

  const [totalPages, setTotalPages] = useState(0);

  const [totalElements, setTotalElements] = useState(0);

  const pageSize = 6;

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getStudentCourses({
        page,
        size: pageSize,
        search,
        sortBy: "title",
        direction: "asc",
      });

      setCourses(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (error) {
      console.error(error);

      setError(
        "Failed to load courses. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, [page, search]);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();

    setPage(0);
    setSearch(searchInput.trim());
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearch("");
    setPage(0);
  };

  const handlePreviousPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) {
      setPage(page + 1);
    }
  };

  return (
    <div className="page-container">

      {/* =========================
          Page Header
      ========================= */}

      <div className="page-header">
        <div>
          <h1>Course Catalog</h1>

          <p>
            Explore published courses and start
            your learning journey.
          </p>
        </div>
      </div>

      {/* =========================
          Search
      ========================= */}

      <div className="card catalog-search">

        <form
          onSubmit={handleSearch}
          className="search-form"
        >

          <input
            type="text"
            placeholder="Search courses by title..."
            value={searchInput}
            onChange={(event) =>
              setSearchInput(event.target.value)
            }
          />

          <button type="submit">
            Search
          </button>

          {search && (
            <button
              type="button"
              className="btn-secondary"
              onClick={handleClearSearch}
            >
              Clear
            </button>
          )}

        </form>

      </div>

      {/* =========================
          Results Information
      ========================= */}

      {!loading && !error && (
        <div className="catalog-results-info">

          <p>
            {search ? (
              <>
                Showing results for{" "}
                <strong>"{search}"</strong>
              </>
            ) : (
              "All published courses"
            )}
          </p>

          <span>
            {totalElements}{" "}
            {totalElements === 1
              ? "course"
              : "courses"}
          </span>

        </div>
      )}

      {/* =========================
          Loading
      ========================= */}

      {loading && (
        <div className="loading-state">
          Loading courses...
        </div>
      )}

      {/* =========================
          Error
      ========================= */}

      {!loading && error && (
        <div>
          <p className="error-message">
            {error}
          </p>

          <button
            type="button"
            onClick={loadCourses}
          >
            Try Again
          </button>
        </div>
      )}

      {/* =========================
          Empty State
      ========================= */}

      {!loading &&
        !error &&
        courses.length === 0 && (
          <div className="empty-state">

            <h2>
              No Courses Found
            </h2>

            <p>
              {search
                ? "No published courses match your search."
                : "There are no published courses available yet."}
            </p>

            {search && (
              <button
                type="button"
                onClick={handleClearSearch}
              >
                View All Courses
              </button>
            )}

          </div>
        )}

      {/* =========================
          Course Cards
      ========================= */}

      {!loading &&
        !error &&
        courses.length > 0 && (
          <div className="grid grid-3">

            {courses.map((course) => (
              <div
                key={course.id}
                className="course-card"
              >

                <div className="course-card-header">

                  <h2>
                    {course.title}
                  </h2>

                  <span className="status-badge status-published">
                    PUBLISHED
                  </span>

                </div>

                <p className="course-card-description">
                  {course.description}
                </p>

                <div className="course-instructor">
                  <span>
                    Instructor
                  </span>

                  <strong>
                    {course.instructorName}
                  </strong>
                </div>

                <div className="course-card-footer">

                  <Link
                    to={`/student/courses/${course.id}`}
                    className="btn-primary"
                  >
                    View Course
                  </Link>

                </div>

              </div>
            ))}

          </div>
        )}

      {/* =========================
          Pagination
      ========================= */}

      {!loading &&
        !error &&
        totalPages > 1 && (
          <div className="pagination">

            <button
              type="button"
              className="btn-secondary"
              onClick={handlePreviousPage}
              disabled={page === 0}
            >
              ← Previous
            </button>

            <span className="pagination-info">
              Page {page + 1} of {totalPages}
            </span>

            <button
              type="button"
              className="btn-secondary"
              onClick={handleNextPage}
              disabled={page >= totalPages - 1}
            >
              Next →
            </button>

          </div>
        )}

    </div>
  );
};

export default StudentCourses;
