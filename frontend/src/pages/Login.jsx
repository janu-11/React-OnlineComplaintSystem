
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn
} from "lucide-react";

import API from "../api";
import "./Auth.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!formData.email || !formData.password) {
      setMessage("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await API.post("/auth/login", {
        email: formData.email.trim(),
        password: formData.password
      });

      // Save login token
      localStorage.setItem("token", response.data.token);

      // Save user information
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      // Redirect based on user role
      if (response.data.user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-icon">
          <LogIn size={30} />
        </div>

        <h1>Welcome Back!</h1>

        <p className="auth-subtitle">
          Login to your Online Complaint Management account.
        </p>

        <form onSubmit={handleSubmit}>

          {/* Email */}
          <label>Email Address</label>

          <div className="input-group">
            <Mail size={19} />

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <label>Password</label>

          <div className="input-group">
            <Lock size={19} />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff size={19} />
              ) : (
                <Eye size={19} />
              )}
            </button>
          </div>

          {/* Error Message */}
          {message && (
            <div className="auth-message">
              {message}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="auth-footer">
          Don't have an account?{" "}
          <Link to="/register">Create Account</Link>
        </p>

      </div>

    </div>
  );
}

export default Login;
