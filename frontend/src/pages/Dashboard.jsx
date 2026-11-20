
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Clock,
  CheckCircle,
  RefreshCw,
  PlusCircle,
  MapPin,
  CalendarDays,
  AlertCircle,
  Image as ImageIcon
} from "lucide-react";

import API from "../api";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }

    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await API.get("/complaints/my", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setComplaints(response.data.complaints || []);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } else {
        setError(
          err.response?.data?.message ||
          "Unable to load complaints. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const pendingCount = complaints.filter(
    (complaint) => complaint.status === "Pending"
  ).length;

  const inProgressCount = complaints.filter(
    (complaint) => complaint.status === "In Progress"
  ).length;

  const resolvedCount = complaints.filter(
    (complaint) => complaint.status === "Resolved"
  ).length;

  const getStatusClass = (status) => {
    return status.toLowerCase().replace(/\s+/g, "-");
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <div className="dashboard-container">

      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {user?.name || "User"}!</h1>
          <p>Track and manage your submitted complaints.</p>
        </div>

        <button
          className="refresh-btn"
          onClick={fetchComplaints}
          disabled={loading}
        >
          <RefreshCw size={17} />
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Statistics */}
      <div className="stats-container">

        <div className="stat-card">
          <div className="stat-icon">
            <FileText size={25} />
          </div>
          <div>
            <h3>Total Complaints</h3>
            <h2>{complaints.length}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Clock size={25} />
          </div>
          <div>
            <h3>Pending</h3>
            <h2>{pendingCount}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <RefreshCw size={25} />
          </div>
          <div>
            <h3>In Progress</h3>
            <h2>{inProgressCount}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <CheckCircle size={25} />
          </div>
          <div>
            <h3>Resolved</h3>
            <h2>{resolvedCount}</h2>
          </div>
        </div>

      </div>

      {/* Complaints Section */}
      <div className="complaints-section">

        <div className="complaints-heading">
          <div>
            <h2>My Complaints</h2>
            <p>View the complaints you have submitted.</p>
          </div>

          <button
            className="new-complaint-btn"
            onClick={() => navigate("/complaint")}
          >
            <PlusCircle size={18} />
            New Complaint
          </button>
        </div>

        {loading && (
          <div className="dashboard-feedback">
            Loading your complaints...
          </div>
        )}

        {error && (
          <div className="dashboard-error">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {!loading && !error && complaints.length === 0 && (
          <div className="empty-state">
            <FileText size={45} />
            <h3>No complaints yet</h3>
            <p>You haven't submitted any complaints.</p>

            <button
              onClick={() => navigate("/complaint")}
              className="new-complaint-btn"
            >
              Submit Your First Complaint
            </button>
          </div>
        )}

        {/* Clickable Complaint List */}
        {!loading && complaints.length > 0 && (
          <div className="complaint-list">

            {complaints.map((complaint) => (
              <div
                className="complaint-item"
                key={complaint._id}
                onClick={() =>
                  navigate(`/complaint/${complaint._id}`)
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    navigate(`/complaint/${complaint._id}`);
                  }
                }}
                role="button"
                tabIndex={0}
                style={{ cursor: "pointer" }}
              >

                <div className="complaint-details">
                  <h3>{complaint.title}</h3>

                  <p>
                    <strong>Category:</strong> {complaint.category}
                  </p>

                  <p>
                    <MapPin size={15} />
                    {complaint.location}
                  </p>

                  <p>
                    <CalendarDays size={15} />
                    {formatDate(complaint.createdAt)}
                  </p>

                  <p className="complaint-description">
                    {complaint.description}
                  </p>

                  <span
                    className={`status-badge ${getStatusClass(
                      complaint.status
                    )}`}
                  >
                    {complaint.status}
                  </span>
                </div>

                {/* Uploaded Complaint Photo */}
                {complaint.image && (
                  <div className="complaint-image-container">
                    <p>
                      <ImageIcon size={15} />
                      Attached Photo
                    </p>

                    <img
                      src={`http://localhost:5000${complaint.image}`}
                      alt="Complaint evidence"
                      className="complaint-photo"
                    />
                  </div>
                )}

                <div className="complaint-open-hint">
                  Click to view details →
                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default Dashboard;
