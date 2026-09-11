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
        <div>
            {/* =========================
          Course Header
      ========================= */}

            <div>
                <Link to="/instructor/courses">
                    ← Back to My Courses
                </Link>

                <h1>Manage Course</h1>

                <p>
                    <strong>Status:</strong> {course.status}
                </p>
            </div>

            {/* =========================
          Messages
      ========================= */}

            {success && (
                <p style={{ color: "green" }}>
                    {success}
                </p>
            )}

            {error && (
                <p style={{ color: "red" }}>
                    {error}
                </p>
            )}

            {/* =========================
          Course Form
      ========================= */}

            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor="title">
                        Course Title
                    </label>

                    <br />

                    <input
                        id="title"
                        type="text"
                        {...register("title")}
                    />

                    {errors.title && (
                        <p style={{ color: "red" }}>
                            {errors.title.message}
                        </p>
                    )}
                </div>

                <br />

                <div>
                    <label htmlFor="description">
                        Course Description
                    </label>

                    <br />

                    <textarea
                        id="description"
                        rows={8}
                        {...register("description")}
                    />

                    {errors.description && (
                        <p style={{ color: "red" }}>
                            {errors.description.message}
                        </p>
                    )}
                </div>

                <br />

                <button
                    type="submit"
                    disabled={saving}
                >
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </form>

            <hr />

            {/* =========================
          Course Actions
      ========================= */}

            <div>
                <h2>Course Actions</h2>

                {course.status !== "PUBLISHED" ? (
                    <button
                        type="button"
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
                    onClick={handleDelete}
                    disabled={actionLoading}
                    style={{ marginLeft: "10px" }}
                >
                    Delete Course
                </button>
            </div>

            <hr />

            {/* =========================
          Module Management
      ========================= */}

            <div>
                <h2>Course Modules</h2>

                {moduleError && (
                    <p style={{ color: "red" }}>
                        {moduleError}
                    </p>
                )}

                {lessonError && (
                    <p style={{ color: "red" }}>
                        {lessonError}
                    </p>
                )}

                <div>
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
                            style={{ marginLeft: "10px" }}
                        >
                            {moduleLoading
                                ? "Processing..."
                                : "Add Module"}
                        </button>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={handleUpdateModule}
                                disabled={moduleLoading}
                                style={{ marginLeft: "10px" }}
                            >
                                {moduleLoading
                                    ? "Processing..."
                                    : "Update Module"}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setEditingModuleId(null);
                                    setModuleTitle("");
                                    setModuleError("");
                                }}
                                disabled={moduleLoading}
                                style={{ marginLeft: "10px" }}
                            >
                                Cancel
                            </button>
                        </>
                    )}
                </div>

                <br />

                {/* Module List */}

                {moduleLoading && modules.length === 0 ? (
                    <p>Loading modules...</p>
                ) : modules.length === 0 ? (
                    <p>No modules created yet.</p>
                ) : (
                    <div>


                        {modules.map((module) => {
                            const moduleLessons = lessons[module.id] || [];

                            return (
                                <div
                                    key={module.id}
                                    style={{
                                        border: "1px solid #ccc",
                                        padding: "20px",
                                        marginBottom: "20px",
                                    }}
                                >
                                    {/* =========================
          Module Header
      ========================= */}

                                    <h3>
                                        Module {module.moduleOrder}: {module.title}
                                    </h3>

                                    <button
                                        type="button"
                                        onClick={() => handleEditModule(module)}
                                        disabled={moduleLoading}
                                    >
                                        Edit Module
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDeleteModule(module.id)
                                        }
                                        disabled={moduleLoading}
                                        style={{ marginLeft: "10px" }}
                                    >
                                        Delete Module
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingLessonId(null);
                                            setEditingModuleIdForLesson(null);

                                            setLessonTitle("");
                                            setLessonContent("");
                                            setLessonError("");

                                            setLessonFormModuleId(module.id);
                                        }}
                                        disabled={lessonLoading}
                                        style={{ marginLeft: "10px" }}
                                    >
                                        + Add Lesson
                                    </button>

                                    <hr />

                                    {/* =========================
          Lessons
      ========================= */}

                                    <h4>Lessons</h4>

                                    {moduleLessons.length === 0 ? (
                                        <p>No lessons created yet.</p>
                                    ) : (
                                        <div>
                                            {moduleLessons.map((lesson) => (
                                                <div
                                                    key={lesson.id}
                                                    style={{
                                                        border: "1px solid #ddd",
                                                        padding: "12px",
                                                        marginBottom: "10px",
                                                    }}
                                                >
                                                    <h5>
                                                        Lesson {lesson.lessonOrder}:{" "}
                                                        {lesson.title}
                                                    </h5>

                                                    <p>
                                                        {lesson.content.length > 150
                                                            ? `${lesson.content.substring(0, 150)}...`
                                                            : lesson.content}
                                                    </p>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleEditLesson(
                                                                module.id,
                                                                lesson
                                                            )
                                                        }
                                                        disabled={lessonLoading}
                                                    >
                                                        Edit Lesson
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDeleteLesson(
                                                                module.id,
                                                                lesson.id
                                                            )
                                                        }
                                                        disabled={lessonLoading}
                                                        style={{ marginLeft: "10px" }}
                                                    >
                                                        Delete Lesson
                                                    </button>


{/* =========================
    Lesson Files
========================= */}

<div
  style={{
    marginTop: "15px",
    padding: "12px",
    background: "#f9f9f9",
  }}
>
  <h6>Lesson Files</h6>

  {fileError && (
    <p style={{ color: "red" }}>
      {fileError}
    </p>
  )}

  {(
    lessonFiles[lesson.id] || []
  ).length === 0 ? (
    <p>No files uploaded.</p>
  ) : (
    <div>
      {(lessonFiles[lesson.id] || []).map(
        (file) => (
          <div
            key={file.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "8px",
            }}
          >
            <span>
              {file.originalFileName}
            </span>

            <span>
              ({(file.fileSize / 1024 / 1024).toFixed(2)} MB)
            </span>

            <a
              href={getLessonFileDownloadUrl(file.id)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Download
            </a>

            <button
              type="button"
              onClick={() =>
                handleDeleteLessonFile(
                  lesson.id,
                  file.id
                )
              }
              disabled={fileLoading}
            >
              Delete
            </button>
          </div>
        )
      )}
    </div>
  )}

  <br />

  {fileUploadLessonId === lesson.id ? (
    <div>
      <input
        type="file"
        accept=".pdf,.mp4,.webm,.ppt,.pptx"
        disabled={fileLoading}
        onChange={(event) => {
          const file = event.target.files?.[0];

          if (file) {
            handleFileUpload(
              lesson.id,
              file
            );
          }

          event.target.value = "";
        }}
      />

      <button
        type="button"
        onClick={() =>
          setFileUploadLessonId(null)
        }
        disabled={fileLoading}
        style={{ marginLeft: "10px" }}
      >
        Cancel
      </button>

      {fileLoading && (
        <p>Uploading file...</p>
      )}
    </div>
  ) : (
    <button
      type="button"
      onClick={() => {
        setFileError("");
        setFileUploadLessonId(lesson.id);
      }}
      disabled={fileLoading}
    >
      + Upload File
    </button>
  )}
</div>



                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* =========================
          Lesson Form
      ========================= */}

                                    {lessonFormModuleId === module.id && (
                                        <div
                                            style={{
                                                marginTop: "15px",
                                                padding: "15px",
                                                background: "#f5f5f5",
                                            }}
                                        >
                                            <h4>
                                                {editingLessonId !== null
                                                    ? "Edit Lesson"
                                                    : "Add Lesson"}
                                            </h4>

                                            <div>
                                                <label
                                                    htmlFor={`lesson-title-${module.id}`}
                                                >
                                                    Lesson Title
                                                </label>

                                                <br />

                                                <input
                                                    id={`lesson-title-${module.id}`}
                                                    type="text"
                                                    placeholder="Enter lesson title"
                                                    value={lessonTitle}
                                                    onChange={(event) =>
                                                        setLessonTitle(event.target.value)
                                                    }
                                                />
                                            </div>

                                            <br />

                                            <div>
                                                <label
                                                    htmlFor={`lesson-content-${module.id}`}
                                                >
                                                    Lesson Content
                                                </label>

                                                <br />

                                                <textarea
                                                    id={`lesson-content-${module.id}`}
                                                    rows={6}
                                                    placeholder="Enter lesson content"
                                                    value={lessonContent}
                                                    onChange={(event) =>
                                                        setLessonContent(event.target.value)
                                                    }
                                                />
                                            </div>

                                            <br />

                                            {editingLessonId !== null ? (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={handleUpdateLesson}
                                                        disabled={lessonLoading}
                                                    >
                                                        {lessonLoading
                                                            ? "Updating..."
                                                            : "Update Lesson"}
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setEditingLessonId(null);
                                                            setEditingModuleIdForLesson(null);

                                                            setLessonFormModuleId(null);

                                                            setLessonTitle("");
                                                            setLessonContent("");
                                                            setLessonError("");
                                                        }}
                                                        disabled={lessonLoading}
                                                        style={{ marginLeft: "10px" }}
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleCreateLesson(module.id)
                                                        }
                                                        disabled={lessonLoading}
                                                    >
                                                        {lessonLoading
                                                            ? "Creating..."
                                                            : "Create Lesson"}
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setLessonFormModuleId(null);

                                                            setLessonTitle("");
                                                            setLessonContent("");
                                                            setLessonError("");
                                                        }}
                                                        disabled={lessonLoading}
                                                        style={{ marginLeft: "10px" }}
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}




                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseEditor;
