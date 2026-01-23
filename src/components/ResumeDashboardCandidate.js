import React, { useEffect, useState } from "react";

function ResumeDashboardCandidate({ onLogout }) {
  const [cvs, setCvs] = useState([]);
  const [file, setFile] = useState(null);

  const backendURL = "https://recruiters-view-backend.onrender.com";
  const token = localStorage.getItem("candidateToken");

  const loadCVs = async () => {
    try {
      const res = await fetch(`${backendURL}/candidate/my-cvs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCvs(data);
    } catch (err) {
      console.error(err);
      alert("Error loading CVs");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("cv", file);

    try {
      const res = await fetch(`${backendURL}/candidate/upload-cv`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        alert("CV uploaded");
        loadCVs();
      } else {
        alert(data.message || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading CV");
    }
  };

  const handleDelete = async (cvId) => {
    try {
      const res = await fetch(`${backendURL}/candidate/delete-cv/${cvId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        alert("CV deleted");
        loadCVs();
      } else {
        alert("Delete failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting CV");
    }
  };

  useEffect(() => {
    loadCVs();
  }, []);

  return (
    <div className="card">
      <h2>Candidate Dashboard</h2>
      <form onSubmit={handleUpload}>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
        <button type="submit">Upload CV</button>
      </form>

      <ul>
        {cvs.map((cv) => (
          <li key={cv._id}>
            {cv.filename}
            <button onClick={() => handleDelete(cv._id)}>Delete</button>
          </li>
        ))}
      </ul>

      <button onClick={onLogout}>Logout</button>
    </div>
  );
}

export default ResumeDashboardCandidate;