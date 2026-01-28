import React, { useState } from "react";

function RecruiterLogin({ onLogin }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    company: ""
  });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("form"); // 'form' or 'otp'

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const requestOtp = async () => {
    // Call backend to send OTP
    // For now, simulate OTP request
    setStep("otp");
  };

  const verifyOtp = async () => {
    // Call backend to verify OTP
    // Simulate success
    const token = "mock-recruiter-token";
    onLogin(token, formData.email);
  };

  return (
    <div className="card">
      <div className="tab-header">Recruiter Login</div>
      {step === "form" && (
        <form>
          <div className="input-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter name"
            />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
            />
          </div>
          <div className="input-group">
            <label>Mobile</label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter mobile number"
            />
          </div>
          <div className="input-group">
            <label>Company (optional)</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Enter company"
            />
          </div>
          <button type="button" onClick={requestOtp}>
            Request OTP
          </button>
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
          <button type="button" onClick={verifyOtp}>
            Verify & Login
          </button>
        </form>
      )}
    </div>
  );
}

export default RecruiterLogin;