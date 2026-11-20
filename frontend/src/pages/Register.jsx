
import { useState } from "react";
import API from "../api";
import { Link } from "react-router-dom";
import { User, Mail, Lock, UserPlus } from "lucide-react";
import "./Auth.css";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

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
    setLoading(true);

    try {
      const response = await API.post("/auth/register", formData);

      setMessage(response.data.message);

      setFormData({
        name: "",
        email: "",
        password: ""
      });
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Registration failed. Please check your server connection."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-icon">
          <UserPlus size={30} />
        </div>

        <h1>Create Account</h1>
        <p className="auth-subtitle">
          Join us and help make your community better.
        </p>

        <form onSubmit={handleSubmit}>
          <label>Full Name</label>
          <div className="input-group">
            <User size={19} />
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

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

          <label>Password</label>
          <div className="input-group">
            <Lock size={19} />
            <input
              type="password"
              name="password"
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={handleChange}
              minLength="6"
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {message && (
          <p className="auth-message">{message}</p>
        )}

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
