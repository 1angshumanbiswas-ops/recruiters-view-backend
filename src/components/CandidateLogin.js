import React, { useState } from "react";

function CandidateLogin({ onLogin }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: ""
  });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const requestOtp = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5500/api/candidates/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: formData.mobile })
      });
      const data = await res.json();
      console.log("Candidate OTP sent:", data);
      setStep("otp");
    } catch (err) {
      console.error("Candidate OTP error:", err);
      setError("Failed to send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5500/api/candidates/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, otp })
      });
      const data = await res.json();
      console.log("Candidate OTP verified:", data);
      if (data.token) {
        onLogin(data.token);
      } else {
        setError("Invalid OTP or login failed.");
      }
    } catch (err) {
      console.error("Candidate verify error:", err);
      setError("Verification failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="tab-header">Candidate Login</div>
      {step === "form" && (
        <form>
          {["name", "email", "mobile"].map((field) => (
            <div className="input-group" key={field}>
              <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={`Enter ${field}`}
              />
            </div>
          ))}
          <button type="button" onClick={requestOtp} disabled={loading}>
            {loading ? "Sending OTP..." : "Request OTP"}
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      )}

      {step === "otp" && (
        <form>
          <div className="input-group">
            <label>Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="6-digit OTP"
            />
          </div>
          <button type="button" onClick={verifyOtp} disabled={loading}>
            {loading ? "Verifying..." : "Verify & Login"}
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      )}
    </div>
  );
}

export default CandidateLogin;