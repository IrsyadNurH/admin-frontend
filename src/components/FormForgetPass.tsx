import { useState, useEffect } from "react";
import Button from "../components/Button";
import Yukmari from "../assets/YukMari.svg";
import Locked from "../assets/locked.svg";
import User from "../assets/user.svg";
import EyeOpen from "../assets/eye.svg";
import EyeClosed from "../assets/eye-crossed.svg";
import { useNavigate } from "react-router-dom";
import ReCaptcha from "./reCaptcha";
import "./styles/App.css";

function Form() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordType, setPasswordType] = useState("password");
  const [error, setError] = useState("");
  const [admins, setAdmins] = useState<any[]>([]);  // State untuk menyimpan data admin

  const togglePasswordVisibility = () => {
    setPasswordType(passwordType === "password" ? "text" : "password");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/admins`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );
  
      console.log("Login response:", response); // Tambahkan log di sini
      if (response.ok) {
        const data = await response.json();
        console.log("Login berhasil:", data);
        navigate("/dashboard");
  
        const adminResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admins`);
        console.log("Admin response:", adminResponse); // Tambahkan log di sini
        if (adminResponse.ok) {
          const adminData = await adminResponse.json();
          setAdmins(adminData.admins);
          console.log("Admins data:", adminData.admins);
        } else {
          setError("Failed to fetch admin data.");
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error); // Menambahkan log error
      setError("Something went wrong. Please try again later.");
    }
  };
  
  return (
    <div className="form-container">
      <div className="title">
        <img src={Yukmari} alt="Yukmari" />
        <p>Please enter your detail</p>
      </div>

      <form onSubmit={handleLogin}>
        <label htmlFor="email">Email</label>
        <div className="input-container">
          <img src={User} alt="User Icon" className="input-icon" />
          <input
            type="email"
            placeholder="Your Email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <label htmlFor="password">Password</label>
        <div className="input-container">
          <img src={Locked} alt="Lock Icon" className="input-icon" />
          <input
            type={passwordType}
            placeholder="Your Password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
            <img
            src={passwordType === "password" ? EyeClosed : EyeOpen}
            alt="Toggle Password Visibility"
            className="toggle-password"
            onClick={togglePasswordVisibility}
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <a onClick={() => navigate("/ForgetPassword")}>Forget Password?</a>

        <ReCaptcha />

        <Button label="Login" />
      </form>

      {/* Menampilkan data admin setelah login */}
  
    </div>
  );
}

export default Form;
