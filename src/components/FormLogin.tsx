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
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);


  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
  }, []);

  
  const handleCaptchaVerify = (token: string | null) => {
    setCaptchaToken(token);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!captchaToken) {
      setError("Please complete the reCAPTCHA verification");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include',
          body: JSON.stringify({ 
            email, 
            password,
            recaptchaToken: captchaToken 
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('userEmail', email);
        if (data.token) {
          localStorage.setItem('token', data.token);
          
          // Log login action with token
          await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/logs`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${data.token}`
            },
            body: JSON.stringify({
              action: 'login',
              user_email: email
            })
          });
        }
        navigate("/dashboard");
      } else {
        setError(data.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("Network error. Please try again later.");
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordType(passwordType === "password" ? "text" : "password");
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
        <ReCaptcha onVerify={handleCaptchaVerify} />
        {error && <p className="error-message">{error}</p>}

        <a onClick={() => navigate("/ForgetPassword")}>Forget Password?</a>

        <Button label="Login" />
      </form>

      {/* Menampilkan data admin setelah login */}
  
    </div>
  );
}

export default Form;
