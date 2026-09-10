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

        {/* Add / Edit Module */}

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
            {modules.map((module) => (
              <div
                key={module.id}
                style={{
                  border: "1px solid #ccc",
                  padding: "15px",
                  marginBottom: "10px",
                }}
              >
                <h3>
                  Module {module.moduleOrder}:{" "}
                  {module.title}
                </h3>

                <button
                  type="button"
                  onClick={() =>
                    handleEditModule(module)
                  }
                  disabled={moduleLoading}
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleDeleteModule(module.id)
                  }
                  disabled={moduleLoading}
                  style={{ marginLeft: "10px" }}
                >
                  Delete
                </button>

                <div style={{ marginTop: "10px" }}>
                  <p>
                    Lessons will be managed inside this
                    module.
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseEditor;
