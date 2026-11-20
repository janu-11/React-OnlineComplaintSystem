
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  CalendarDays,
  FileText,
  Image as ImageIcon,
  AlertCircle,
  Clock,
  CheckCircle
} from "lucide-react";

import API from "../api";
import "./ComplaintDetails.css";

function ComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await API.get(`/complaints/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setComplaint(response.data.complaint);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Unable to load complaint details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [id, navigate]);

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Resolved":
        return <CheckCircle size={18} />;
      case "In Progress":
        return <Clock size={18} />;
      default:
        return <AlertCircle size={18} />;
    }
  };

  if (loading) {
    return (
      <div className="details-message">
        Loading complaint details...
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="details-message">
        <AlertCircle size={22} />
        <p>{error || "Complaint not found."}</p>
        <button onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="details-page">

      <button
        className="back-button"
        onClick={() => navigate("/dashboard")}
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      <div className="details-card">

        <div className="details-header">
          <div>
            <span className="details-label">COMPLAINT DETAILS</span>
            <h1>{complaint.title}</h1>
            <p>Complaint ID: {complaint._id}</p>
          </div>

          <span
            className={`details-status ${complaint.status
              .toLowerCase()
              .replace(/\s+/g, "-")}`}
          >
            {getStatusIcon(complaint.status)}
            {complaint.status}
          </span>
        </div>

        <div className="details-divider" />

        <div className="details-information">

          <div className="details-field">
            <FileText size={19} />
            <div>
              <span>Category</span>
              <strong>{complaint.category}</strong>
            </div>
          </div>

          <div className="details-field">
            <MapPin size={19} />
            <div>
              <span>Location</span>
              <strong>{complaint.location}</strong>
            </div>
          </div>

          <div className="details-field">
            <CalendarDays size={19} />
            <div>
              <span>Submitted On</span>
              <strong>{formatDate(complaint.createdAt)}</strong>
            </div>
          </div>

        </div>

        <div className="details-description">
          <h2>Description</h2>
          <p>{complaint.description}</p>
        </div>

        {complaint.image && (
          <div className="details-image-section">
            <h2>
              <ImageIcon size={20} />
              Uploaded Evidence
            </h2>

            <img
              src={`http://localhost:5000${complaint.image}`}
              alt="Complaint evidence"
              className="details-image"
            />
          </div>
        )}

        {complaint.adminRemarks && (
          <div className="admin-remarks">
            <h2>Admin Remarks</h2>
            <p>{complaint.adminRemarks}</p>
          </div>
        )}

      </div>
    </div>
  );
}

export default ComplaintDetails;
