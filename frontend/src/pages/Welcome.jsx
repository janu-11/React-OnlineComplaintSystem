
import { useNavigate } from "react-router-dom";
import {
  Users,
  ShieldCheck,
  FileText,
  ArrowRight
} from "lucide-react";

import "./Welcome.css";

function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="welcome-page">

      <nav className="welcome-nav">
        <div className="welcome-logo">
          <FileText size={27} />
          <span>ResolveNow</span>
        </div>

        <span className="welcome-tagline">
          Online Complaint Management System
        </span>
      </nav>

      <main className="welcome-content">

        <div className="welcome-heading">
          <span className="welcome-badge">
            YOUR VOICE MATTERS
          </span>

          <h1>
            Making Complaints.
            <br />
            <span>Making Change.</span>
          </h1>

          <p>
            A simple and transparent platform to report issues,
            manage complaints and track their resolution.
          </p>
        </div>

        <div className="portal-container">

          <div className="portal-card citizen-card">
            <div className="portal-icon citizen-icon">
              <Users size={32} />
            </div>

            <span className="portal-label">FOR CITIZENS</span>

            <h2>Citizen Portal</h2>

            <p>
              Have an issue to report? Submit your complaint,
              upload photos and track its progress.
            </p>

            <button
              onClick={() => navigate("/login")}
              className="portal-button citizen-button"
            >
              Citizen Login
              <ArrowRight size={18} />
            </button>

            <div className="portal-footer">
              New citizen?
              <button onClick={() => navigate("/register")}>
                Create Account
              </button>
            </div>
          </div>

          <div className="portal-card admin-card">
            <div className="portal-icon admin-icon">
              <ShieldCheck size={32} />
            </div>

            <span className="portal-label">AUTHORIZED PERSONNEL</span>

            <h2>Admin Portal</h2>

            <p>
              Manage submitted complaints, review evidence,
              update complaint status and add remarks.
            </p>

            <button
              onClick={() => navigate("/admin-login")}
              className="portal-button admin-button"
            >
              Admin Login
              <ArrowRight size={18} />
            </button>

            <div className="portal-footer">
              Restricted access for administrators
            </div>
          </div>

        </div>

        <p className="welcome-bottom">
          Together, we can build a better community.
        </p>

      </main>
    </div>
  );
}

export default Welcome;
