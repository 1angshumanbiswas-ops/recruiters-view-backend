import React, { useState } from "react";

function RecruiterLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");

  const backendURL = "https://recruiters-view-backend.onrender.com";

  // Email + Password Login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${backendURL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        // Store recruiter details
        localStorage.setItem("recruiterToken", data.token);
        localStorage.setItem("recruiterName", data.recruiter?.name || "");
        localStorage.setItem("recruiterEmail", data.recruiter?.email || email);
        localStorage.setItem("recruiterMobile", data.recruiter?.mobile || "");

        // Pass token + email back to App.js
        onLogin(data.token, email);
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    }
  };

  // Mobile + OTP Login
  const handleOtpLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${backendURL}/otp-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        // Store recruiter details
        localStorage.setItem("recruiterToken", data.token);
        localStorage.setItem("recruiterName", data.recruiter?.name || "");
        localStorage.setItem("recruiterEmail", data.recruiter?.email || "");
        localStorage.setItem("recruiterMobile", data.recruiter?.mobile || mobile);

        // Pass token + mobile back to App.js
        onLogin(data.token, mobile);
      } else {
        alert(data.message || "OTP login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    }
  };

  return (
    <div className="card">
      <h2>Recruiter Login</h2>

      {/* Email + Password Login */}
      <form onSubmit={handleEmailLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br />
        <button type="submit">Login with Email</button>
      </form>

      <hr />

      {/* Mobile + OTP Login */}
      <form onSubmit={handleOtpLogin}>
        <input
          type="text"
          placeholder="Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          required
        /><br />
        <input
          type="text"
          placeholder="6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        /><br />
        <button type="submit">Login with OTP</button>
      </form>
    </div>
  );
}

export default RecruiterLogin;