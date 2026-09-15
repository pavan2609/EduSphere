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

  maxSeats: z
    .number()
    .int("Maximum seats must be a whole number")
    .positive("Maximum seats must be greater than zero"),
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
    defaultValues: {
  title: "",
  description: "",
  maxSeats: 30,
},
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
    <div className="page-container">

      <div className="page-header">
        <div>
          <h1>Create Course</h1>
          <p>
            Create a new course and start adding
            modules and lessons.
          </p>
        </div>
      </div>

      <div className="card">

        <form
          className="auth-form"
          onSubmit={handleSubmit(onSubmit)}
        >

          <div className="form-group">
            <label htmlFor="title">
              Course Title
            </label>

            <input
              id="title"
              type="text"
              placeholder="Enter course title"
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
              Description
            </label>

            <textarea
              id="description"
              rows={8}
              placeholder="Enter course description"
              {...register("description")}
            />

            {errors.description && (
              <p className="form-error">
                {errors.description.message}
              </p>
            )}
          </div>
            <div className="form-group">
  <label htmlFor="maxSeats">
    Maximum Seats
  </label>

  <input
    id="maxSeats"
    type="number"
    min="1"
    {...register("maxSeats", {
      valueAsNumber: true,
    })}
    placeholder="Enter maximum seats"
  />

  {errors.maxSeats && (
    <p className="form-error">
      {errors.maxSeats.message}
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

    </div>
  );
};

export default CreateCourse;
