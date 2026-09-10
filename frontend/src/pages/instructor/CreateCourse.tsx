import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import {
  createCourse,
} from "../../services/courseService";

const courseSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(150, "Title cannot exceed 150 characters"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description cannot exceed 2000 characters"),
});

type CourseFormData = z.infer<typeof courseSchema>;

const CreateCourse = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
  });

  const onSubmit = async (data: CourseFormData) => {
    try {
      const course = await createCourse(data);

      navigate(
        `/instructor/courses/${course.id}`
      );
    } catch (error) {
      console.error(error);
      alert("Failed to create course.");
    }
  };

  return (
    <div>
      <h1>Create Course</h1>

      <form onSubmit={handleSubmit(onSubmit)}>

        <div>
          <label>Course Title</label>

          <input
            type="text"
            {...register("title")}
          />

          {errors.title && (
            <p>{errors.title.message}</p>
          )}
        </div>

        <div>
          <label>Description</label>

          <textarea
            rows={6}
            {...register("description")}
          />

          {errors.description && (
            <p>
              {errors.description.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Creating..."
            : "Create Course"}
        </button>

      </form>
    </div>
  );
};

export default CreateCourse;