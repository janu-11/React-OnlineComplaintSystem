
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  FileText,
  Clock,
  CheckCircle,
  RefreshCw,
  LogOut,
  MapPin,
  CalendarDays,
  AlertCircle
} from "lucide-react";

import API from "../api";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const statuses = [
    "Pending",
    "In Progress",
    "Resolved",
    "Rejected"
  ];

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await API.get("/complaints/admin/all", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("ADMIN COMPLAINTS RESPONSE:", response.data);

      setComplaints(response.data.complaints || []);

    } catch (err) {
      console.error("ADMIN COMPLAINT FETCH ERROR:", err);
      console.error("ERROR RESPONSE:", err.response?.data);
      console.error("HTTP STATUS:", err.response?.status);

      setError(
        err.response?.data?.message ||
        err.message ||
        "Unable to load complaints."
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      navigate("/admin-login");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);

      if (parsedUser.role !== "admin") {
        navigate("/dashboard");
        return;
      }

      setAdmin(parsedUser);
      fetchComplaints();

    } catch (err) {
      console.error("ADMIN USER ERROR:", err);

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/admin-login");
    }
  }, [navigate]);

  // Update complaint status
  const handleStatusUpdate = async (complaintId, newStatus) => {
    try {
      setUpdatingId(complaintId);
      setMessage("");
      setError("");

      const token = localStorage.getItem("token");

      const response = await API.patch(
        `/complaints/admin/${complaintId}/status`,
        {
          status: newStatus
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Update the complaint in the dashboard
      setComplaints((previousComplaints) =>
        previousComplaints.map((complaint) =>
          complaint._id === complaintId
            ? {
                ...complaint,
                status: response.data.complaint?.status || newStatus
              }
            : complaint
        )
      );

      setMessage("Complaint status updated successfully!");

    } catch (err) {
      console.error("STATUS UPDATE ERROR:", err);
      console.error("UPDATE RESPONSE:", err.response?.data);

      setError(
        err.response?.data?.message ||
        "Unable to update complaint status."
      );

      // Reload the saved status if update fails
      fetchComplaints();

    } finally {
      setUpdatingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  const pending = complaints.filter(
    (complaint) => complaint.status === "Pending"
  ).length;

  const inProgress = complaints.filter(
    (complaint) => complaint.status === "In Progress"
  ).length;

  const resolved = complaints.filter(
    (complaint) => complaint.status === "Resolved"
  ).length;

  const rejected = complaints.filter(
    (complaint) => complaint.status === "Rejected"
  ).length;

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <div className="admin-dashboard">

      {/* Header */}
      <header className="admin-header">

        <div className="admin-brand">
          <ShieldCheck size={30} />

          <div>
            <h2>Admin Portal</h2>
            <p>Complaint Management System</p>
          </div>
        </div>

        <div className="admin-header-right">

          <span>
            Welcome, {admin?.name || "Admin"}
          </span>

          <button
            onClick={handleLogout}
            className="admin-logout"
          >
            <LogOut size={17} />
            Logout
          </button>

        </div>
      </header>

      <main className="admin-main">

        {/* Dashboard Heading */}
        <div className="admin-welcome">

          <div>
            <h1>Admin Dashboard</h1>
            <p>
              Monitor and manage all citizen complaints.
            </p>
          </div>

          <button
            className="admin-refresh"
            onClick={fetchComplaints}
            disabled={loading}
          >
            <RefreshCw size={17} />
            {loading ? "Loading..." : "Refresh"}
          </button>

        </div>

        {/* Success Message */}
        {message && (
          <div className="admin-message">
            <CheckCircle size={19} />
            <span>{message}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="admin-error">
            <AlertCircle size={19} />
            <span>{error}</span>
          </div>
        )}

        {/* Statistics */}
        <div className="admin-stats">

          <div className="admin-stat-card">
            <FileText size={27} />

            <div>
              <p>Total Complaints</p>
              <h2>{complaints.length}</h2>
            </div>
          </div>

          <div className="admin-stat-card">
            <Clock size={27} />

            <div>
              <p>Pending</p>
              <h2>{pending}</h2>
            </div>
          </div>

          <div className="admin-stat-card">
            <RefreshCw size={27} />

            <div>
              <p>In Progress</p>
              <h2>{inProgress}</h2>
            </div>
          </div>

          <div className="admin-stat-card">
            <CheckCircle size={27} />

            <div>
              <p>Resolved</p>
              <h2>{resolved}</h2>
            </div>
          </div>

          <div className="admin-stat-card">
            <AlertCircle size={27} />

            <div>
              <p>Rejected</p>
              <h2>{rejected}</h2>
            </div>
          </div>

        </div>

        {/* All Complaints */}
        <section className="admin-complaints">

          <div className="admin-section-heading">

            <div>
              <h2>All Citizen Complaints</h2>

              <p>
                Review complaints submitted by registered citizens.
              </p>
            </div>

            <span>
              {complaints.length} Records
            </span>

          </div>

          {loading && (
            <p className="admin-loading">
              Loading complaints...
            </p>
          )}

          {!loading && !error && complaints.length === 0 && (
            <div className="admin-empty">

              <FileText size={42} />

              <h3>No complaints found</h3>

              <p>
                Citizen complaints will appear here when submitted.
              </p>

            </div>
          )}

          {!loading && complaints.length > 0 && (
            <div className="admin-table-wrapper">

              <table className="admin-table">

                <thead>
                  <tr>
                    <th>Complaint</th>
                    <th>Citizen</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Update Status</th>
                  </tr>
                </thead>

                <tbody>

                  {complaints.map((complaint) => (

                    <tr key={complaint._id}>

                      <td>
                        <strong>
                          {complaint.title}
                        </strong>

                        <small>
                          ID: {complaint._id?.slice(-8)}
                        </small>
                      </td>

                      <td>
                        {complaint.user?.name || "Unknown"}

                        <small>
                          {complaint.user?.email || ""}
                        </small>
                      </td>

                      <td>
                        {complaint.category}
                      </td>

                      <td>
                        <MapPin size={14} />
                        {complaint.location}
                      </td>

                      <td>
                        <CalendarDays size={14} />
                        {formatDate(complaint.createdAt)}
                      </td>

                      <td>
                        <span
                          className={`admin-status ${(
                            complaint.status || "Pending"
                          ).toLowerCase().replace(/\s+/g, "-")}`}
                        >
                          {complaint.status || "Pending"}
                        </span>
                      </td>

                      {/* Status Update Dropdown */}
                      <td>
                        <select
                          className="admin-status-select"
                          value={complaint.status || "Pending"}
                          disabled={updatingId === complaint._id}
                          onChange={(e) =>
                            handleStatusUpdate(
                              complaint._id,
                              e.target.value
                            )
                          }
                        >
                          {statuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>

                        {updatingId === complaint._id && (
                          <small>Updating...</small>
                        )}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>
          )}

        </section>

      </main>

    </div>
  );
}

export default AdminDashboard;
