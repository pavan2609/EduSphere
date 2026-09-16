import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    getMyEnrollments,
} from "../../services/enrollmentService";

import type {
    Enrollment,
} from "../../services/enrollmentService";

import {
    getCourseProgress,
} from "../../services/studentCourseDetailsService";

import type {
    CourseProgress,
} from "../../services/studentCourseDetailsService";


interface MyCourse extends Enrollment {
    progress: CourseProgress | null;
}


const StudentMyCourses = () => {

    const [courses, setCourses] = useState<MyCourse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    const loadMyCourses = async () => {

        try {

            setLoading(true);
            setError("");

            const enrollments = await getMyEnrollments();

            const coursesWithProgress = await Promise.all(
                enrollments.map(async (enrollment) => {

                    try {

                        const progress =
                            await getCourseProgress(
                                enrollment.courseId
                            );

                        return {
                            ...enrollment,
                            progress,
                        };

                    } catch (error) {

                        console.error(
                            `Failed to load progress for course ${enrollment.courseId}`,
                            error
                        );

                        return {
                            ...enrollment,
                            progress: null,
                        };
                    }
                })
            );

            setCourses(coursesWithProgress);

        } catch (error) {

            console.error(
                "Failed to load enrolled courses",
                error
            );

            setError(
                "Failed to load your courses. Please try again."
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {
        loadMyCourses();
    }, []);


    if (loading) {

        return (
            <div className="page-container">

                <div className="loading-state">
                    Loading your courses...
                </div>

            </div>
        );
    }


    if (error) {

        return (
            <div className="page-container">

                <div className="error-message">
                    {error}
                </div>

                <button
                    type="button"
                    className="btn-primary"
                    onClick={loadMyCourses}
                >
                    Try Again
                </button>

            </div>
        );
    }


    return (

        <div className="page-container">

            <div className="page-header">

                <div>
                    <h1>My Learning</h1>

                    <p>
                        Continue learning from your enrolled courses.
                    </p>
                </div>

            </div>


            {courses.length === 0 ? (

                <div className="empty-state">

                    <h2>No courses yet</h2>

                    <p>
                        You are not enrolled in any courses yet.
                    </p>

                    <Link
                        to="/student/courses"
                        className="btn-primary"
                    >
                        Browse Courses
                    </Link>

                </div>

            ) : (

                <div className="my-learning-grid">

                    {courses.map((course) => {

                        const progressPercentage =
                            course.progress?.progressPercentage ?? 0;

                        const completedLessons =
                            course.progress?.completedLessons ?? 0;

                        const totalLessons =
                            course.progress?.totalLessons ?? 0;


                        return (

                            <div
                                key={course.id}
                                className="my-learning-card"
                            >

                                <div className="my-learning-card-header">

                                    <div>

                                        <h2>
                                            {course.courseTitle}
                                        </h2>

                                        <span className="learning-status">
                                            {course.status}
                                        </span>

                                    </div>

                                </div>


                                <div className="my-learning-progress">

                                    <div className="my-learning-progress-header">

                                        <span>
                                            Progress
                                        </span>

                                        <strong>
                                            {Math.round(
                                                progressPercentage
                                            )}
                                            %
                                        </strong>

                                    </div>


                                    <div className="my-learning-progress-bar">

                                        <div
                                            className="my-learning-progress-fill"
                                            style={{
                                                width: `${Math.min(
                                                    progressPercentage,
                                                    100
                                                )}%`,
                                            }}
                                        />

                                    </div>


                                    <p>
                                        {completedLessons} of{" "}
                                        {totalLessons} lessons completed
                                    </p>

                                </div>


                                <div className="my-learning-card-footer">

                                    <Link
                                        to={`/student/courses/${course.courseId}`}
                                        className="btn-primary"
                                    >
                                        {progressPercentage > 0
                                            ? "Continue Learning"
                                            : "Start Learning"}
                                    </Link>

                                </div>

                            </div>

                        );

                    })}

                </div>

            )}

        </div>
    );
};


export default StudentMyCourses;
