
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck, Lock, Mail } from "lucide-react";

import API from "../api";
import "./Auth.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      setLoading(true);

      const response = await API.post("/auth/login", {
        email: email.trim(),
        password
      });

      if (response.data.user.role !== "admin") {
        setMessage("Access denied. This account is not an administrator.");
        return;
      }

      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      navigate("/admin-dashboard");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Invalid admin credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-icon">
          <ShieldCheck size={30} />
        </div>

        <h1>Admin Login</h1>

        <p className="auth-subtitle">
          Authorized administrators only.
        </p>

        <form onSubmit={handleSubmit}>
          <label>Admin Email</label>

          <div className="input-group">
            <Mail size={19} />
            <input
              type="email"
              placeholder="Enter admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <label>Password</label>

          <div className="input-group">
            <Lock size={19} />
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {message && (
            <div className="auth-message">
              {message}
            </div>
          )}

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Secure Admin Login"}
          </button>
        </form>

        <p className="auth-footer">
          <Link to="/">Back to Home</Link>
        </p>

      </div>
    </div>
  );
}

export default AdminLogin;
