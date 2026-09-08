import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),

  password: z
    .string()
    .min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
      try {
          const response = await loginUser(data);

          console.log("Login response:", response);
        localStorage.setItem("accessToken", response.token);
        localStorage.setItem("refreshToken", response.refreshToken);
        
          login(response.token, {
              id: response.userId,
              name: response.name,
              email: response.email,
              role: response.role,
          });

          if (response.role === "ADMIN") {
              navigate("/admin/dashboard");
          } else if (response.role === "INSTRUCTOR") {
              navigate("/instructor/dashboard");
      } else {
        navigate("/student/dashboard");
      }
    } catch (error: any) {
      console.error("Login failed:", error);

      const message =
        error.response?.data?.message ||
        "Invalid email or password";

      setError("root", {
        message,
      });
    }
  };

  return (
    <div>
      <h1>EduSphere</h1>

      <h2>Login</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
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

        {errors.root && (
          <p>{errors.root.message}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>

      <p>
        Don't have an account?{" "}
        <Link to="/register">
          Register
        </Link>
      </p>
    </div>
  );
}

export default Login;