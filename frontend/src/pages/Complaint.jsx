
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Send,
  FileText,
  Upload,
  Image as ImageIcon,
  X
} from "lucide-react";

import API from "../api";
import "./Complaint.css";

function Complaint() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: ""
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp"
    ];

    if (!allowedTypes.includes(file.type)) {
      setMessage("Please select a JPG, PNG or WEBP image.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Image size must be less than 5 MB.");
      e.target.value = "";
      return;
    }

    setMessage("");
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setImage(null);
    setPreview("");

    const fileInput = document.getElementById("complaint-image");

    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const data = new FormData();

    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("location", formData.location);

    if (image) {
      data.append("image", image);
    }

    setLoading(true);

    try {
      const response = await API.post(
        "/complaints",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage(response.data.message);

      setTimeout(() => {
        navigate("/dashboard");
      }, 1200);

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Unable to submit complaint. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="complaint-page">

      <div className="complaint-container">

        <Link to="/dashboard" className="back-link">
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <div className="complaint-card">

          <div className="complaint-heading-icon">
            <FileText size={30} />
          </div>

          <h1>Submit a Complaint</h1>

          <p className="complaint-subtitle">
            Tell us about the issue. Our team will review
            your complaint and work towards resolving it.
          </p>

          <form onSubmit={handleSubmit}>

            <label>Complaint Title</label>

            <input
              type="text"
              name="title"
              placeholder="Example: Damaged road near my house"
              value={formData.title}
              onChange={handleChange}
              required
            />

            <label>Complaint Category</label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              <option value="Road Damage">Road Damage</option>
              <option value="Water Supply">Water Supply</option>
              <option value="Garbage">Garbage</option>
              <option value="Streetlight">Streetlight</option>
              <option value="Drainage">Drainage</option>
              <option value="Electricity">Electricity</option>
              <option value="Public Safety">Public Safety</option>
              <option value="Other">Other</option>
            </select>

            <label>Location</label>

            <input
              type="text"
              name="location"
              placeholder="Enter the location of the problem"
              value={formData.location}
              onChange={handleChange}
              required
            />

            <label>Complaint Description</label>

            <textarea
              name="description"
              placeholder="Describe the issue in detail..."
              rows="5"
              value={formData.description}
              onChange={handleChange}
              required
            />

            <label>Upload Complaint Photo (Optional)</label>

            <div className="image-upload-area">

              <input
                id="complaint-image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                hidden
              />

              {!preview ? (
                <label
                  htmlFor="complaint-image"
                  className="image-upload-label"
                >
                  <Upload size={30} />
                  <strong>Choose an Image</strong>
                  <span>JPG, PNG or WEBP · Maximum 5 MB</span>
                </label>
              ) : (
                <div className="image-preview">
                  <img src={preview} alt="Complaint preview" />

                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={removeImage}
                    aria-label="Remove selected image"
                  >
                    <X size={18} />
                  </button>

                  <p>
                    <ImageIcon size={15} />
                    {image?.name}
                  </p>
                </div>
              )}

            </div>

            <button
              type="submit"
              disabled={loading}
              className="submit-complaint-btn"
            >
              <Send size={18} />
              {loading ? "Submitting..." : "Submit Complaint"}
            </button>

          </form>

          {message && (
            <p className="complaint-message">
              {message}
            </p>
          )}

        </div>
      </div>
    </div>
  );
}

export default Complaint;
