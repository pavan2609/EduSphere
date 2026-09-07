import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";

const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters"),

    email: z
      .string()
      .min(1, "Email is required")
      .email("Enter a valid email address"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters"),

    confirmPassword: z
      .string()
      .min(1, "Please confirm your password"),

    role: z.enum(["STUDENT", "INSTRUCTOR"]),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

type RegisterFormData = z.infer<typeof registerSchema>;

function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "STUDENT",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      });

      console.log("Registration successful:", response);

      navigate("/login");
    } catch (error: any) {
      console.error("Registration failed:", error);

      const message =
        error.response?.data?.message ||
        "Registration failed. Please try again.";

      setError("root", {
        message,
      });
    }
  };

  return (
    <div>
      <h1>EduSphere</h1>

      <h2>Create Account</h2>

      <form onSubmit={handleSubmit(onSubmit)}>

        <div>
          <label>Name</label>

          <input
            type="text"
            placeholder="Enter your name"
            {...register("name")}
          />

          {errors.name && (
            <p>{errors.name.message}</p>
          )}
        </div>

        <div>
          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            {...register("email")}
          />

          {errors.email && (
            <p>{errors.email.message}</p>
          )}
        </div>

        <div>
          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            {...register("password")}
          />

          {errors.password && (
            <p>{errors.password.message}</p>
          )}
        </div>

        <div>
          <label>Confirm Password</label>

          <input
            type="password"
            placeholder="Confirm your password"
            {...register("confirmPassword")}
          />

          {errors.confirmPassword && (
            <p>{errors.confirmPassword.message}</p>
          )}
        </div>

        <div>
          <label>Role</label>

          <select {...register("role")}>
            <option value="STUDENT">Student</option>
            <option value="INSTRUCTOR">Instructor</option>
          </select>

          {errors.role && (
            <p>{errors.role.message}</p>
          )}
        </div>

        {errors.root && (
          <p>{errors.root.message}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Creating Account..."
            : "Register"}
        </button>
      </form>

      <p>
        Already have an account?{" "}
        <Link to="/login">
          Login
        </Link>
      </p>
    </div>
  );
}

export default Register;