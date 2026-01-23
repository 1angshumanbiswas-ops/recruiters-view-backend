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

    // Admin bypass check
    if (email === "1angshuman.biswas@gmail.com") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
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
        <div style={{ marginTop: "20px" }}>
          <button
            style={{ marginRight: "10px" }}
            onClick={() => setView("candidate")}
          >
            Candidate Login
          </button>
          <button onClick={() => setView("recruiter")}>Recruiter Login</button>
        </div>
      )}

      {/* Recruiter Flow */}
      {view === "recruiter" && !recruiterToken && (
        <RecruiterLogin onLogin={(token, email) => handleRecruiterLogin(token, email)} />
      )}
      {view === "recruiter" && recruiterToken && (
        isAdmin ? (
          <ResumeDashboardAdmin onLogout={logout} />
        ) : (
          <ResumeDashboardRecruiter onLogout={logout} />
        )
      )}

      {/* Candidate Flow */}
      {view === "candidate" && !candidateToken && (
        <CandidateLogin onLogin={handleCandidateLogin} />
      )}
      {view === "candidate" && candidateToken && (
        <ResumeDashboardCandidate onLogout={logout} />
      )}
    </div>
  );
}

export default App;