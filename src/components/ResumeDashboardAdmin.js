import React, { useEffect, useState } from "react";

function ResumeDashboardAdmin({ onLogout }) {
  const [recruiters, setRecruiters] = useState([]);
  const [candidates, setCandidates] = useState([]);

  const backendURL = "https://recruiters-view-backend.onrender.com";
  const token = localStorage.getItem("recruiterToken"); // admin bypass uses recruiter token

  // Load recruiter stats
  const loadRecruiters = async () => {
    try {
      const res = await fetch(`${backendURL}/recruiters`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRecruiters(data);
    } catch (err) {
      console.error(err);
      alert("Error loading recruiters");
    }
  };

  // Load candidate CVs
  const loadCandidates = async () => {
    try {
      const res = await fetch(`${backendURL}/candidates`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCandidates(data);
    } catch (err) {
      console.error(err);
      alert("Error loading candidates");
    }
  };

  // Delete CV (Admin only)
  const deleteCV = async (cvId) => {
    try {
      const res = await fetch(`${backendURL}/admin/delete-cv/${cvId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        alert("CV deleted");
        loadCandidates();
      } else {
        alert("Failed to delete CV");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting CV");
    }
  };

  useEffect(() => {
    loadRecruiters();
    loadCandidates();
  }, []);

  return (
    <div className="card">
      <h2>Admin Dashboard</h2>

      <h3>Recruiter Stats</h3>
      <ul>
        {recruiters.map((r) => (
          <li key={r._id}>
            {r.name} - {r.email} - {r.mobile}
          </li>
        ))}
      </ul>

      <h3>Candidate CVs</h3>
      <ul>
        {candidates.map((c) => (
          <li key={c._id}>
            {c.name} - {c.email}
            {c.cvs.map((cv) => (
              <div key={cv._id}>
                {cv.filename}
                <button onClick={() => deleteCV(cv._id)}>Delete CV</button>
              </div>
            ))}
          </li>
        ))}
      </ul>

      <button onClick={onLogout}>Logout</button>
    </div>
  );
}

export default ResumeDashboardAdmin;