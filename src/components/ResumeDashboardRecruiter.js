import React, { useEffect, useState } from "react";

function ResumeDashboardRecruiter({ onLogout }) {
  const [recruiters, setRecruiters] = useState([]);

  const backendURL = "https://recruiters-view-backend.onrender.com";
  const token = localStorage.getItem("recruiterToken");

  // Load recruiter data
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

  useEffect(() => {
    loadRecruiters();
  }, []);

  return (
    <div className="card">
      <h2>Recruiter Dashboard</h2>

      <h3>Recruiter Data</h3>
      <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead style={{ backgroundColor: "#e0f2e9" }}>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Login Count</th>
          </tr>
        </thead>
        <tbody>
          {recruiters.map((r) => (
            <tr key={r._id}>
              <td>{r.name}</td>
              <td>{r.email}</td>
              <td>{r.mobile}</td>
              <td>{r.loginCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button style={{ marginTop: "20px" }} onClick={onLogout}>
        Logout
      </button>
    </div>
  );
}

export default ResumeDashboardRecruiter;