import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    deleteCourse,
    getMyCourses,
    publishCourse,
    unpublishCourse,
    updateCourse,
} from "../../services/courseService";

import type { CourseResponse } from "../../services/courseService";

import {
    createModule,
    deleteModule,
    getModules,
    updateModule,
} from "../../services/moduleService";

import type { ModuleResponse } from "../../services/moduleService";

import {
    createLesson,
    deleteLesson,
    getLessons,
    updateLesson,
} from "../../services/lessonService";

import type { LessonResponse } from "../../services/lessonService";


import {
  deleteLessonFile,
  getLessonFileDownloadUrl,
  getLessonFiles,
  uploadLessonFile,
} from "../../services/lessonFileService";

import type {
  LessonFileResponse,
} from "../../services/lessonFileService";

const courseSchema = z.object({
    title: z
        .string()
        .min(3, "Course title must be at least 3 characters")
        .max(150, "Course title cannot exceed 150 characters"),

    description: z
        .string()
        .min(10, "Course description must be at least 10 characters")
        .max(2000, "Course description cannot exceed 2000 characters"),
      maxSeats: z
    .number()
    .int("Maximum seats must be a whole number")
    .positive("Maximum seats must be greater than zero"),
});

type CourseFormData = z.infer<typeof courseSchema>;

const CourseEditor = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();

    // =========================
    // Course State
    // =========================

    const [course, setCourse] = useState<CourseResponse | null>(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // =========================
    // Module State
    // =========================

    const [modules, setModules] = useState<ModuleResponse[]>([]);
    const [moduleTitle, setModuleTitle] = useState("");
    const [moduleLoading, setModuleLoading] = useState(false);
    const [moduleError, setModuleError] = useState("");
    const [editingModuleId, setEditingModuleId] = useState<number | null>(
        null
    );

    // =========================
    // Course Form
    // =========================

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CourseFormData>({
        resolver: zodResolver(courseSchema),
    });

    // =========================
    // Load Course
    // =========================

    const loadCourse = async () => {
        try {
            setLoading(true);
            setError("");

            const courses = await getMyCourses();

            const selectedCourse = courses.find(
                (item) => item.id === Number(courseId)
            );

            if (!selectedCourse) {
                setError("Course not found.");
                return;
            }

            setCourse(selectedCourse);

            reset({
                title: selectedCourse.title,
                description: selectedCourse.description,
            });
        } catch (error) {
            console.error(error);
            setError("Failed to load course.");
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // Load Modules
    // =========================

    const loadModules = async () => {
        if (!courseId) {
            return;
        }

        try {
            setModuleLoading(true);
            setModuleError("");

            const data = await getModules(Number(courseId));

            setModules(data);

            for (const module of data) {
                await loadLessonsForModule(module.id);
            }
        } catch (error) {
            console.error(error);
            setModuleError("Failed to load modules.");
        } finally {
            setModuleLoading(false);
        }
    };

    // =========================
    // Initial Loading
    // =========================

    useEffect(() => {
        loadCourse();
    }, [courseId]);

    useEffect(() => {
        if (course) {
            loadModules();
        }
    }, [course]);

    // =========================
    // Update Course
    // =========================

    const onSubmit = async (data: CourseFormData) => {
        if (!course) {
            return;
        }

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const updatedCourse = await updateCourse(course.id, data);

            setCourse(updatedCourse);

            reset({
                title: updatedCourse.title,
                description: updatedCourse.description,
            });

            setSuccess("Course updated successfully.");
        } catch (error) {
            console.error(error);
            setError("Failed to update course.");
        } finally {
            setSaving(false);
        }
    };

    // =========================
    // Publish Course
    // =========================

    const handlePublish = async () => {
        if (!course) {
            return;
        }

        try {
            setActionLoading(true);
            setError("");
            setSuccess("");

            const updatedCourse = await publishCourse(course.id);

            setCourse(updatedCourse);

            setSuccess("Course published successfully.");
        } catch (error) {
            console.error(error);
            setError("Failed to publish course.");
        } finally {
            setActionLoading(false);
        }
    };

    // =========================
    // Unpublish Course
    // =========================

    const handleUnpublish = async () => {
        if (!course) {
            return;
        }

        try {
            setActionLoading(true);
            setError("");
            setSuccess("");

            const updatedCourse = await unpublishCourse(course.id);

            setCourse(updatedCourse);

            setSuccess("Course unpublished successfully.");
        } catch (error) {
            console.error(error);
            setError("Failed to unpublish course.");
        } finally {
            setActionLoading(false);
        }
    };

    // =========================
    // Delete Course
    // =========================

    const handleDelete = async () => {
        if (!course) {
            return;
        }

        const confirmed = window.confirm(
            "Are you sure you want to delete this course?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setActionLoading(true);
            setError("");

            await deleteCourse(course.id);

            navigate("/instructor/courses");
        } catch (error) {
            console.error(error);
            setError("Failed to delete course.");
            setActionLoading(false);
        }
    };

    // =========================
    // Create Module
    // =========================

    const handleCreateModule = async () => {
        if (!courseId) {
            return;
        }

        const title = moduleTitle.trim();

        if (!title) {
            setModuleError("Module title is required.");
            return;
        }

        if (title.length < 3) {
            setModuleError("Module title must be at least 3 characters.");
            return;
        }

        try {
            setModuleLoading(true);
            setModuleError("");

            await createModule(Number(courseId), {
                title,
                moduleOrder: modules.length + 1,
            });

            setModuleTitle("");

            await loadModules();
        } catch (error) {
            console.error(error);
            setModuleError("Failed to create module.");
        } finally {
            setModuleLoading(false);
        }
    };

    // =========================
    // Start Module Editing
    // =========================

    const handleEditModule = (module: ModuleResponse) => {
        setEditingModuleId(module.id);
        setModuleTitle(module.title);
        setModuleError("");
    };

    // =========================
    // Update Module
    // =========================

    const handleUpdateModule = async () => {
        if (!courseId || editingModuleId === null) {
            return;
        }

        const title = moduleTitle.trim();

        if (!title) {
            setModuleError("Module title is required.");
            return;
        }

        if (title.length < 3) {
            setModuleError("Module title must be at least 3 characters.");
            return;
        }

        const existingModule = modules.find(
            (item) => item.id === editingModuleId
        );

        if (!existingModule) {
            setModuleError("Module not found.");
            return;
        }

        try {
            setModuleLoading(true);
            setModuleError("");

            await updateModule(Number(courseId), editingModuleId, {
                title,
                moduleOrder: existingModule.moduleOrder,
            });

            setModuleTitle("");
            setEditingModuleId(null);

            await loadModules();
        } catch (error) {
            console.error(error);
            setModuleError("Failed to update module.");
        } finally {
            setModuleLoading(false);
        }
    };

    // =========================
    // Delete Module
    // =========================

    const handleDeleteModule = async (moduleId: number) => {
        if (!courseId) {
            return;
        }

        const confirmed = window.confirm(
            "Are you sure you want to delete this module?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setModuleLoading(true);
            setModuleError("");

            await deleteModule(Number(courseId), moduleId);

            await loadModules();
        } catch (error) {
            console.error(error);
            setModuleError("Failed to delete module.");
        } finally {
            setModuleLoading(false);
        }
    };

    // =========================
    // Lesson State
    // =========================

    const [lessons, setLessons] = useState<
        Record<number, LessonResponse[]>
    >({});

    const [lessonTitle, setLessonTitle] = useState("");
    const [lessonContent, setLessonContent] = useState("");

    const [lessonLoading, setLessonLoading] = useState(false);
    const [lessonError, setLessonError] = useState("");

    const [editingLessonId, setEditingLessonId] =
        useState<number | null>(null);

    const [editingModuleIdForLesson, setEditingModuleIdForLesson] =
        useState<number | null>(null);

    const [lessonFormModuleId, setLessonFormModuleId] =
        useState<number | null>(null);

   const loadLessonsForModule = async (moduleId: number) => {
  try {
    setLessonError("");

    const data = await getLessons(moduleId);

    setLessons((previous) => ({
      ...previous,
      [moduleId]: data,
    }));

    for (const lesson of data) {
      await loadLessonFiles(lesson.id);
    }
  } catch (error) {
    console.error(error);
    setLessonError(
      `Failed to load lessons for module ${moduleId}.`
    );
  }
};
    const handleCreateLesson = async (moduleId: number) => {
        const title = lessonTitle.trim();
        const content = lessonContent.trim();

        if (!title) {
            setLessonError("Lesson title is required.");
            return;
        }

        if (title.length < 3) {
            setLessonError(
                "Lesson title must be at least 3 characters."
            );
            return;
        }

        if (!content) {
            setLessonError("Lesson content is required.");
            return;
        }

        try {
            setLessonLoading(true);
            setLessonError("");

            const moduleLessons = lessons[moduleId] || [];

            await createLesson(moduleId, {
                title,
                content,
                lessonOrder: moduleLessons.length + 1,
            });

            setLessonTitle("");
            setLessonContent("");
            setLessonFormModuleId(null);

            await loadLessonsForModule(moduleId);
        } catch (error) {
            console.error(error);
            setLessonError("Failed to create lesson.");
        } finally {
            setLessonLoading(false);
        }
    };

    const handleEditLesson = (
        moduleId: number,
        lesson: LessonResponse
    ) => {
        setEditingLessonId(lesson.id);
        setEditingModuleIdForLesson(moduleId);
        setLessonFormModuleId(moduleId);

        setLessonTitle(lesson.title);
        setLessonContent(lesson.content);

        setLessonError("");
    };

    const handleUpdateLesson = async () => {
        if (
            editingLessonId === null ||
            editingModuleIdForLesson === null
        ) {
            return;
        }

        const title = lessonTitle.trim();
        const content = lessonContent.trim();

        if (!title) {
            setLessonError("Lesson title is required.");
            return;
        }

        if (title.length < 3) {
            setLessonError(
                "Lesson title must be at least 3 characters."
            );
            return;
        }

        if (!content) {
            setLessonError("Lesson content is required.");
            return;
        }

        const moduleLessons =
            lessons[editingModuleIdForLesson] || [];

        const existingLesson = moduleLessons.find(
            (lesson) => lesson.id === editingLessonId
        );

        if (!existingLesson) {
            setLessonError("Lesson not found.");
            return;
        }

        try {
            setLessonLoading(true);
            setLessonError("");

            await updateLesson(
                editingModuleIdForLesson,
                editingLessonId,
                {
                    title,
                    content,
                    lessonOrder: existingLesson.lessonOrder,
                }
            );

            setLessonTitle("");
            setLessonContent("");

            setEditingLessonId(null);
            setEditingModuleIdForLesson(null);
            setLessonFormModuleId(null);

            await loadLessonsForModule(
                editingModuleIdForLesson
            );
        } catch (error) {
            console.error(error);
            setLessonError("Failed to update lesson.");
        } finally {
            setLessonLoading(false);
        }
    };

    const handleDeleteLesson = async (
        moduleId: number,
        lessonId: number
    ) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this lesson?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setLessonLoading(true);
            setLessonError("");

            await deleteLesson(moduleId, lessonId);

            await loadLessonsForModule(moduleId);
        } catch (error) {
            console.error(error);
            setLessonError("Failed to delete lesson.");
        } finally {
            setLessonLoading(false);
        }
    };

// =========================
// Lesson File State
// =========================

const [lessonFiles, setLessonFiles] = useState<
  Record<number, LessonFileResponse[]>
>({});

const [fileLoading, setFileLoading] = useState(false);
const [fileError, setFileError] = useState("");

const [fileUploadLessonId, setFileUploadLessonId] =
  useState<number | null>(null);

const loadLessonFiles = async (lessonId: number) => {
  try {
    setFileError("");

    const data = await getLessonFiles(lessonId);

    setLessonFiles((previous) => ({
      ...previous,
      [lessonId]: data,
    }));
  } catch (error) {
    console.error(error);
    setFileError(
      "Failed to load lesson files."
    );
  }
};

const validateLessonFile = (file: File): string | null => {
  const maxFileSize = 100 * 1024 * 1024;

  const allowedTypes = [
    "application/pdf",
    "video/mp4",
    "video/webm",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ];

  if (file.size > maxFileSize) {
    return "File size cannot exceed 100 MB.";
  }

  if (!allowedTypes.includes(file.type)) {
    return "Only PDF, MP4, WebM, PPT and PPTX files are allowed.";
  }

  return null;
};

const handleFileUpload = async (
  lessonId: number,
  file: File
) => {
  const validationError = validateLessonFile(file);

  if (validationError) {
    setFileError(validationError);
    return;
  }

  try {
    setFileLoading(true);
    setFileError("");

    await uploadLessonFile(lessonId, file);

    await loadLessonFiles(lessonId);

    setFileUploadLessonId(null);
  } catch (error) {
    console.error(error);
    setFileError("Failed to upload file.");
  } finally {
    setFileLoading(false);
  }
};

const handleDeleteLessonFile = async (
  lessonId: number,
  fileId: number
) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this file?"
  );

  if (!confirmed) {
    return;
  }

  try {
    setFileLoading(true);
    setFileError("");

    await deleteLessonFile(fileId);

    await loadLessonFiles(lessonId);
  } catch (error) {
    console.error(error);
    setFileError("Failed to delete file.");
  } finally {
    setFileLoading(false);
  }
};

    // =========================
    // Loading State
    // =========================

    if (loading) {
        return <p>Loading course...</p>;
    }

    // =========================
    // Course Not Found
    // =========================

    if (error && !course) {
        return (
            <div>
                <p>{error}</p>

                <Link to="/instructor/courses">
                    Back to My Courses
                </Link>
            </div>
        );
    }

    if (!course) {
        return <p>Course not found.</p>;
    }

    // =========================
    // UI
    // =========================

    
    return (
        <div className="course-editor">

            {/* =========================
                Course Header
            ========================= */}

            <div className="page-header">
                <div>
                    <Link
                        to="/instructor/courses"
                        className="back-link"
                    >
                        ← Back to My Courses
                    </Link>

                    <h1>Manage Course</h1>

                    <div>
                        <span className="status-label">
                            Status:
                        </span>

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
                </div>
            </div>

            {/* =========================
                Messages
            ========================= */}

            {success && (
                <p className="success-message">
                    {success}
                </p>
            )}

            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}

            {/* =========================
                Course Details
            ========================= */}

            <section className="course-editor-section">

                <div className="course-editor-section-header">
                    <div>
                        <h2>Course Details</h2>
                        <p>
                            Update your course information.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>

                    <div className="form-group">
                        <label htmlFor="title">
                            Course Title
                        </label>

                        <input
                            id="title"
                            type="text"
                            {...register("title")}
                        />

                        {errors.title && (
                            <p className="form-error">
                                {errors.title.message}
                            </p>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">
                            Course Description
                        </label>

                        <textarea
                            id="description"
                            rows={8}
                            {...register("description")}
                        />

                        {errors.description && (
                            <p className="form-error">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                    >
                        {saving
                            ? "Saving..."
                            : "Save Changes"}
                    </button>

                </form>

            </section>

            {/* =========================
                Course Actions
            ========================= */}

            <section className="course-editor-section">

                <div className="course-editor-section-header">
                    <div>
                        <h2>Course Actions</h2>
                        <p>
                            Manage the publication status of
                            your course.
                        </p>
                    </div>
                </div>

                <div className="button-group">

                    {course.status !== "PUBLISHED" ? (
                        <button
                            type="button"
                            className="btn-success"
                            onClick={handlePublish}
                            disabled={actionLoading}
                        >
                            {actionLoading
                                ? "Processing..."
                                : "Publish Course"}
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={handleUnpublish}
                            disabled={actionLoading}
                        >
                            {actionLoading
                                ? "Processing..."
                                : "Unpublish Course"}
                        </button>
                    )}

                    <button
                        type="button"
                        className="btn-danger"
                        onClick={handleDelete}
                        disabled={actionLoading}
                    >
                        Delete Course
                    </button>

                </div>

            </section>

            {/* =========================
                Module Management
            ========================= */}

            <section className="course-editor-section">

                <div className="course-editor-section-header">
                    <div>
                        <h2>Course Modules</h2>
                        <p>
                            Organize your course into modules
                            and lessons.
                        </p>
                    </div>
                </div>

                {moduleError && (
                    <p className="error-message">
                        {moduleError}
                    </p>
                )}

                {lessonError && (
                    <p className="error-message">
                        {lessonError}
                    </p>
                )}

                <div className="module-create-bar">

                    <input
                        type="text"
                        placeholder="Enter module title"
                        value={moduleTitle}
                        onChange={(event) =>
                            setModuleTitle(event.target.value)
                        }
                    />

                    {editingModuleId === null ? (
                        <button
                            type="button"
                            onClick={handleCreateModule}
                            disabled={moduleLoading}
                        >
                            {moduleLoading
                                ? "Processing..."
                                : "Add Module"}
                        </button>
                    ) : (
                        <div className="button-group">

                            <button
                                type="button"
                                onClick={handleUpdateModule}
                                disabled={moduleLoading}
                            >
                                {moduleLoading
                                    ? "Processing..."
                                    : "Update Module"}
                            </button>

                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={() => {
                                    setEditingModuleId(null);
                                    setModuleTitle("");
                                    setModuleError("");
                                }}
                                disabled={moduleLoading}
                            >
                                Cancel
                            </button>

                        </div>
                    )}

                </div>

                {/* Module List */}

                {moduleLoading && modules.length === 0 ? (
                    <div className="loading-state">
                        Loading modules...
                    </div>
                ) : modules.length === 0 ? (
                    <div className="empty-state">
                        <h3>No Modules Yet</h3>
                        <p>
                            Add your first module to start
                            building this course.
                        </p>
                    </div>
                ) : (
                    <div className="module-list">

                        {modules.map((module) => {
                            const moduleLessons =
                                lessons[module.id] || [];

                            return (
                                <div
                                    key={module.id}
                                    className="module-card"
                                >

                                    {/* Module Header */}

                                    <div className="module-header">

                                        <div>
                                            <div className="module-title">
                                                Module {module.moduleOrder}
                                            </div>

                                            <h3>
                                                {module.title}
                                            </h3>
                                        </div>

                                        <div className="module-actions">

                                            <button
                                                type="button"
                                                className="btn-secondary"
                                                onClick={() =>
                                                    handleEditModule(module)
                                                }
                                                disabled={moduleLoading}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                className="btn-danger"
                                                onClick={() =>
                                                    handleDeleteModule(
                                                        module.id
                                                    )
                                                }
                                                disabled={moduleLoading}
                                            >
                                                Delete
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEditingLessonId(null);
                                                    setEditingModuleIdForLesson(
                                                        null
                                                    );

                                                    setLessonTitle("");
                                                    setLessonContent("");
                                                    setLessonError("");

                                                    setLessonFormModuleId(
                                                        module.id
                                                    );
                                                }}
                                                disabled={lessonLoading}
                                            >
                                                + Add Lesson
                                            </button>

                                        </div>

                                    </div>

                                    {/* Lessons */}

                                    <div className="lesson-section">

                                        <h4>Lessons</h4>

                                        {moduleLessons.length === 0 ? (
                                            <div className="empty-state">
                                                <p>
                                                    No lessons created yet.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="lesson-list">

                                                {moduleLessons.map(
                                                    (lesson) => (
                                                        <div
                                                            key={lesson.id}
                                                            className="lesson-card"
                                                        >

                                                            <div className="lesson-header">

                                                                <div>
                                                                    <h5 className="lesson-title">
                                                                        Lesson{" "}
                                                                        {
                                                                            lesson.lessonOrder
                                                                        }
                                                                        :{" "}
                                                                        {
                                                                            lesson.title
                                                                        }
                                                                    </h5>

                                                                    <p className="lesson-content-preview">
                                                                        {
                                                                            lesson
                                                                                .content
                                                                                .length >
                                                                            150
                                                                                ? `${lesson.content.substring(
                                                                                      0,
                                                                                      150
                                                                                  )}...`
                                                                                : lesson.content
                                                                        }
                                                                    </p>
                                                                </div>

                                                                <div className="lesson-actions">

                                                                    <button
                                                                        type="button"
                                                                        className="btn-secondary"
                                                                        onClick={() =>
                                                                            handleEditLesson(
                                                                                module.id,
                                                                                lesson
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            lessonLoading
                                                                        }
                                                                    >
                                                                        Edit
                                                                    </button>

                                                                    <button
                                                                        type="button"
                                                                        className="btn-danger"
                                                                        onClick={() =>
                                                                            handleDeleteLesson(
                                                                                module.id,
                                                                                lesson.id
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            lessonLoading
                                                                        }
                                                                    >
                                                                        Delete
                                                                    </button>

                                                                </div>

                                                            </div>

                                                            {/* Lesson Files */}

                                                            <div className="file-section">

                                                                <div className="file-section-header">
                                                                    <h6>
                                                                        Lesson
                                                                        Files
                                                                    </h6>
                                                                </div>

                                                                {fileError && (
                                                                    <p className="error-message">
                                                                        {fileError}
                                                                    </p>
                                                                )}

                                                                {(
                                                                    lessonFiles[
                                                                        lesson.id
                                                                    ] || []
                                                                ).length ===
                                                                0 ? (
                                                                    <p className="empty-text">
                                                                        No files
                                                                        uploaded.
                                                                    </p>
                                                                ) : (
                                                                    <div className="file-list">

                                                                        {(
                                                                            lessonFiles[
                                                                                lesson.id
                                                                            ] ||
                                                                            []
                                                                        ).map(
                                                                            (
                                                                                file
                                                                            ) => (
                                                                                <div
                                                                                    key={
                                                                                        file.id
                                                                                    }
                                                                                    className="file-item"
                                                                                >

                                                                                    <div className="file-info">

                                                                                        <span className="file-name">
                                                                                            {
                                                                                                file.originalFileName
                                                                                            }
                                                                                        </span>

                                                                                        <span className="file-size">
                                                                                            (
                                                                                            {(
                                                                                                file.fileSize /
                                                                                                1024 /
                                                                                                1024
                                                                                            ).toFixed(
                                                                                                2
                                                                                            )}{" "}
                                                                                            MB
                                                                                            )
                                                                                        </span>

                                                                                    </div>

                                                                                    <div className="button-group">

                                                                                        <a
                                                                                            href={getLessonFileDownloadUrl(
                                                                                                file.id
                                                                                            )}
                                                                                            target="_blank"
                                                                                            rel="noopener noreferrer"
                                                                                            className="btn-link"
                                                                                        >
                                                                                            Download
                                                                                        </a>

                                                                                        <button
                                                                                            type="button"
                                                                                            className="btn-danger"
                                                                                            onClick={() =>
                                                                                                handleDeleteLessonFile(
                                                                                                    lesson.id,
                                                                                                    file.id
                                                                                                )
                                                                                            }
                                                                                            disabled={
                                                                                                fileLoading
                                                                                            }
                                                                                        >
                                                                                            Delete
                                                                                        </button>

                                                                                    </div>

                                                                                </div>
                                                                            )
                                                                        )}

                                                                    </div>
                                                                )}

                                                                {fileUploadLessonId ===
                                                                lesson.id ? (
                                                                    <div className="file-upload-form">

                                                                        <input
                                                                            type="file"
                                                                            accept=".pdf,.mp4,.webm,.ppt,.pptx"
                                                                            disabled={
                                                                                fileLoading
                                                                            }
                                                                            onChange={(
                                                                                event
                                                                            ) => {
                                                                                const file =
                                                                                    event
                                                                                        .target
                                                                                        .files?.[0];

                                                                                if (
                                                                                    file
                                                                                ) {
                                                                                    handleFileUpload(
                                                                                        lesson.id,
                                                                                        file
                                                                                    );
                                                                                }

                                                                                event.target.value =
                                                                                    "";
                                                                            }}
                                                                        />

                                                                        <button
                                                                            type="button"
                                                                            className="btn-secondary"
                                                                            onClick={() =>
                                                                                setFileUploadLessonId(
                                                                                    null
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                fileLoading
                                                                            }
                                                                        >
                                                                            Cancel
                                                                        </button>

                                                                        {fileLoading && (
                                                                            <p className="loading-text">
                                                                                Uploading
                                                                                file...
                                                                            </p>
                                                                        )}

                                                                    </div>
                                                                ) : (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setFileError(
                                                                                ""
                                                                            );
                                                                            setFileUploadLessonId(
                                                                                lesson.id
                                                                            );
                                                                        }}
                                                                        disabled={
                                                                            fileLoading
                                                                        }
                                                                    >
                                                                        + Upload
                                                                        File
                                                                    </button>
                                                                )}

                                                            </div>

                                                        </div>
                                                    )
                                                )}

                                            </div>
                                        )}

                                    </div>

                                    {/* Lesson Form */}

                                    {lessonFormModuleId === module.id && (
                                        <div className="lesson-form">

                                            <h4>
                                                {editingLessonId !== null
                                                    ? "Edit Lesson"
                                                    : "Add Lesson"}
                                            </h4>

                                            <div className="form-group">

                                                <label
                                                    htmlFor={`lesson-title-${module.id}`}
                                                >
                                                    Lesson Title
                                                </label>

                                                <input
                                                    id={`lesson-title-${module.id}`}
                                                    type="text"
                                                    placeholder="Enter lesson title"
                                                    value={lessonTitle}
                                                    onChange={(event) =>
                                                        setLessonTitle(
                                                            event.target.value
                                                        )
                                                    }
                                                />

                                            </div>

                                            <div className="form-group">

                                                <label
                                                    htmlFor={`lesson-content-${module.id}`}
                                                >
                                                    Lesson Content
                                                </label>

                                                <textarea
                                                    id={`lesson-content-${module.id}`}
                                                    rows={6}
                                                    placeholder="Enter lesson content"
                                                    value={lessonContent}
                                                    onChange={(event) =>
                                                        setLessonContent(
                                                            event.target.value
                                                        )
                                                    }
                                                />

                                            </div>

                                            {editingLessonId !== null ? (
                                                <div className="button-group">

                                                    <button
                                                        type="button"
                                                        onClick={
                                                            handleUpdateLesson
                                                        }
                                                        disabled={
                                                            lessonLoading
                                                        }
                                                    >
                                                        {lessonLoading
                                                            ? "Updating..."
                                                            : "Update Lesson"}
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="btn-secondary"
                                                        onClick={() => {
                                                            setEditingLessonId(
                                                                null
                                                            );
                                                            setEditingModuleIdForLesson(
                                                                null
                                                            );
                                                            setLessonFormModuleId(
                                                                null
                                                            );
                                                            setLessonTitle("");
                                                            setLessonContent("");
                                                            setLessonError("");
                                                        }}
                                                        disabled={
                                                            lessonLoading
                                                        }
                                                    >
                                                        Cancel
                                                    </button>

                                                </div>
                                            ) : (
                                                <div className="button-group">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleCreateLesson(
                                                                module.id
                                                            )
                                                        }
                                                        disabled={
                                                            lessonLoading
                                                        }
                                                    >
                                                        {lessonLoading
                                                            ? "Creating..."
                                                            : "Create Lesson"}
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="btn-secondary"
                                                        onClick={() => {
                                                            setLessonFormModuleId(
                                                                null
                                                            );
                                                            setLessonTitle("");
                                                            setLessonContent("");
                                                            setLessonError("");
                                                        }}
                                                        disabled={
                                                            lessonLoading
                                                        }
                                                    >
                                                        Cancel
                                                    </button>

                                                </div>
                                            )}

                                        </div>
                                    )}

                                </div>
                            );
                        })}

                    </div>
                )}

            </section>

        </div>
    );
};

export default CourseEditor;


