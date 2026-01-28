import React, { useState } from "react";
import RecruiterLogin from "./components/RecruiterLogin";
import CandidateLogin from "./components/CandidateLogin";
import ResumeDashboardRecruiter from "./components/ResumeDashboardRecruiter";
import ResumeDashboardCandidate from "./components/ResumeDashboardCandidate";
import ResumeDashboardAdmin from "./components/ResumeDashboardAdmin";

function App() {
  const [view, setView] = useState("home"); // 'home', 'recruiter', 'candidate'
  const [recruiterToken, setRecruiterToken] = useState(localStorage.getItem("recruiterToken") || null);
  const [candidateToken, setCandidateToken] = useState(localStorage.getItem("candidateToken") || null);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleRecruiterLogin = (token, email) => {
    localStorage.setItem("recruiterToken", token);
    setRecruiterToken(token);
    setIsAdmin(email === "1angshuman.biswas@gmail.com");
  };

  const handleCandidateLogin = (token) => {
    localStorage.setItem("candidateToken", token);
    setCandidateToken(token);
  };

  const logout = () => {
    localStorage.clear();
    setRecruiterToken(null);
    setCandidateToken(null);
    setIsAdmin(false);
    setView("home");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Recruiter Views Portal</h1>

      {view === "home" && (
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "30px" }}>
          <div style={{ width: "48%" }}>
            <h2>Recruiter Access</h2>
            {!recruiterToken ? (
              <RecruiterLogin onLogin={handleRecruiterLogin} />
            ) : isAdmin ? (
              <ResumeDashboardAdmin onLogout={logout} />
            ) : (
              <ResumeDashboardRecruiter onLogout={logout} />
            )}
          </div>

          <div style={{ width: "48%" }}>
            <h2>Candidate Access</h2>
            {!candidateToken ? (
              <CandidateLogin onLogin={handleCandidateLogin} />
            ) : (
              <ResumeDashboardCandidate onLogout={logout} />
            )}
          </div>
        </div>
      )}

      {(view === "recruiter" || view === "candidate") && (
        <button style={{ marginTop: "20px" }} onClick={logout}>
          Sign Out
        </button>
      )}
    </div>
  );
}

export default App;