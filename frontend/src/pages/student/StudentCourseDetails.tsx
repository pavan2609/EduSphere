import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    getStudentCourseDetails,
} from "../../services/studentCourseDetailsService";
import type {
    StudentCourseDetails as StudentCourseDetailsType,
    StudentLesson,
} from "../../services/studentCourseDetailsService";
import {
    enrollInCourse,
    getMyEnrollments,
} from "../../services/enrollmentService";

const StudentCourseDetails = () => {
    const { courseId } = useParams<{ courseId: string }>();

    const [course, setCourse] =
        useState<StudentCourseDetailsType | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [expandedModules, setExpandedModules] =
        useState<number[]>([]);

    const [selectedLesson, setSelectedLesson] =
        useState<StudentLesson | null>(null);

    const [enrollmentStatus, setEnrollmentStatus] =
        useState<"ENROLLED" | "WAITLISTED" | "COMPLETED" | null>(null);

    const [enrolling, setEnrolling] = useState(false);
    const [enrollmentError, setEnrollmentError] = useState("");
const loadEnrollmentStatus = async (courseId: number) => {
        try {
            const enrollments = await getMyEnrollments();

            const enrollment = enrollments.find(
                (item) => item.courseId === courseId
            );

            if (enrollment) {
                setEnrollmentStatus(enrollment.status);
            } else {
                setEnrollmentStatus(null);
            }
        } catch (error) {
            console.error(error);
        }
    };
    const loadCourse = async () => {
        if (!courseId) {
            setError("Invalid course.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const data = await getStudentCourseDetails(
                Number(courseId)
            );

            setCourse(data);
            await loadEnrollmentStatus(data.id);

            if (data.modules.length > 0) {
                setExpandedModules([data.modules[0].id]);

                if (data.modules[0].lessons.length > 0) {
                    setSelectedLesson(data.modules[0].lessons[0]);
                }
            }
        } catch (error) {
            console.error(error);
            setError(
                "Failed to load course details. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCourse();
    }, [courseId]);

    const toggleModule = (moduleId: number) => {
        setExpandedModules((current) =>
            current.includes(moduleId)
                ? current.filter((id) => id !== moduleId)
                : [...current, moduleId]
        );
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) {
            return `${bytes} B`;
        }

        if (bytes < 1024 * 1024) {
            return `${(bytes / 1024).toFixed(1)} KB`;
        }

        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    if (loading) {
        return (
            <div className="page-container">
                <div className="loading-state">
                    Loading course...
                </div>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="page-container">
                <Link
                    to="/student/courses"
                    className="btn-secondary"
                >
                    ← Back to Courses
                </Link>

                <div className="error-message course-details-error">
                    {error || "Course not found."}
                </div>
            </div>
        );
    }
    

    const handleEnrollment = async () => {
        if (!course) {
            return;
        }

        try {
            setEnrolling(true);
            setEnrollmentError("");

            const enrollment = await enrollInCourse(course.id);

            setEnrollmentStatus(enrollment.status);
        } catch (error: any) {
            console.error(error);

            setEnrollmentError(
                error.response?.data?.message ||
                "Unable to enroll in this course."
            );
        } finally {
            setEnrolling(false);
        }
    };

    return (
        <div className="page-container student-course-details">

            {/* Course Header */}
            <div className="course-details-header">
                <div className="course-enrollment">
                    {enrollmentStatus === null && (
                        <button
                            type="button"
                            className="btn-primary enrollment-button"
                            onClick={handleEnrollment}
                            disabled={enrolling}
                        >
                            {enrolling ? "Processing..." : "Enroll Now"}
                        </button>
                    )}

                    {enrollmentStatus === "ENROLLED" && (
                        <div className="enrollment-success">
                            ✓ You are enrolled in this course
                        </div>
                    )}

                    {enrollmentStatus === "WAITLISTED" && (
                        <div className="enrollment-waitlist">
                            ✓ You have been added to the waitlist
                        </div>
                    )}

                    {enrollmentStatus === "COMPLETED" && (
                        <div className="enrollment-success">
                            ✓ Course completed
                        </div>
                    )}

                    {enrollmentError && (
                        <p className="error-message enrollment-error">
                            {enrollmentError}
                        </p>
                    )}
                </div>
                <div>
                    <Link
                        to="/student/courses"
                        className="back-link"
                    >
                        ← Back to Courses
                    </Link>

                    <div className="course-details-title-row">
                        <h1>{course.title}</h1>

                        <span className="status-badge status-published">
                            PUBLISHED
                        </span>
                    </div>

                    <p className="course-details-description">
                        {course.description}
                    </p>

                    <div className="course-details-instructor">
                        <span>Instructor</span>
                        <strong>{course.instructorName}</strong>
                    </div>
                </div>
            </div>

            {/* Course Content */}
            <div className="student-course-layout">

                {/* Left: Course Structure */}
                <aside className="course-outline card">
                    <div className="course-outline-header">
                        <h2>Course Content</h2>

                        <span>
                            {course.modules.length}{" "}
                            {course.modules.length === 1
                                ? "module"
                                : "modules"}
                        </span>
                    </div>

                    {course.modules.length === 0 ? (
                        <div className="empty-state">
                            <p>No learning content available yet.</p>
                        </div>
                    ) : (
                        <div className="module-list">
                            {course.modules.map((module) => {
                                const isExpanded =
                                    expandedModules.includes(module.id);

                                return (
                                    <div
                                        key={module.id}
                                        className="student-module"
                                    >
                                        <button
                                            type="button"
                                            className="student-module-header"
                                            onClick={() =>
                                                toggleModule(module.id)
                                            }
                                        >
                                            <div>
                                                <span className="module-number">
                                                    Module {module.moduleOrder}
                                                </span>

                                                <strong>{module.title}</strong>
                                            </div>

                                            <span className="module-toggle">
                                                {isExpanded ? "−" : "+"}
                                            </span>
                                        </button>

                                        {isExpanded && (
                                            <div className="student-lesson-list">
                                                {module.lessons.length === 0 ? (
                                                    <div className="student-no-lessons">
                                                        No lessons available.
                                                    </div>
                                                ) : (
                                                    module.lessons.map((lesson) => (
                                                        <button
                                                            type="button"
                                                            key={lesson.id}
                                                            className={`student-lesson-item ${selectedLesson?.id === lesson.id
                                                                    ? "selected"
                                                                    : ""
                                                                }`}
                                                            onClick={() =>
                                                                setSelectedLesson(lesson)
                                                            }
                                                        >
                                                            <span className="lesson-number">
                                                                {lesson.lessonOrder}
                                                            </span>

                                                            <span className="lesson-title">
                                                                {lesson.title}
                                                            </span>
                                                        </button>
                                                    ))
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </aside>

                {/* Right: Lesson Content */}
                <section className="lesson-content card">
                    {!selectedLesson ? (
                        <div className="lesson-empty">
                            <h2>Start Learning</h2>
                            <p>
                                Select a lesson from the course content
                                to begin.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="lesson-content-header">
                                <div>
                                    <span className="lesson-label">
                                        Lesson {selectedLesson.lessonOrder}
                                    </span>

                                    <h2>{selectedLesson.title}</h2>
                                </div>
                            </div>

                            <div className="lesson-body">
                                {selectedLesson.content ? (
                                    <p>{selectedLesson.content}</p>
                                ) : (
                                    <p className="text-muted">
                                        No lesson description available.
                                    </p>
                                )}
                            </div>

                            {/* Lesson Files */}
                            {selectedLesson.files.length > 0 && (
                                <div className="student-files">
                                    <h3>Learning Materials</h3>

                                    <div className="student-file-list">
                                        {selectedLesson.files.map((file) => (
                                            <div
                                                key={file.id}
                                                className="student-file-item"
                                            >
                                                <div className="student-file-info">
                                                    <strong>
                                                        {file.originalFileName}
                                                    </strong>

                                                    <span>
                                                        {file.fileType} •{" "}
                                                        {formatFileSize(file.fileSize)}
                                                    </span>
                                                </div>

                                                <a
                                                    href={`http://localhost:8080/api/instructor/lessons/files/${file.id}/download`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn-secondary"
                                                >
                                                    Open
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </section>
            </div>
        </div>
    );
};

export default StudentCourseDetails;