import { useState } from "react";
import { verifyOtp } from "../api/authApi";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";
  const { fetchUser } = useContext(AuthContext); // Get fetchUser function

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await verifyOtp({ email, otp });
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        console.log(response.data.token);
        await fetchUser(); // ✅ Immediately update user data

        navigate("/");
      }
    } catch (err) {
      setError("Invalid OTP. Please try again.");
    }
  };

  return (
    <div>
      <h2>Verify OTP</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
        <button type="submit">Verify</button>
      </form>
    </div>
  );
};

export default VerifyOtp;
