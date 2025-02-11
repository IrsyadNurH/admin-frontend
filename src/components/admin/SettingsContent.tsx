import { FC, useState, useEffect } from "react";
import axios from 'axios';
import { z } from 'zod';
import EyeOpen from "../../assets/eye.svg";
import EyeClosed from "../../assets/eye-crossed.svg";


const emailSchema = z.object({
  email: z.string().email("Invalid email format")
});

const passwordSchema = z.object({
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
});

const SettingsContent: FC = () => {
  const [email, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admins`);
        if (response.data.admins && response.data.admins.length > 0) {
          setEmail(response.data.admins[0].email);
        }
      } catch (error) {
        setError('Failed to load admin data');
        console.error('Error:', error);
      }
    };

    fetchAdminData();
  }, []);

  const handleEmailChange = async () => {
    try {
      // Validate email
      const validationResult = emailSchema.safeParse({ email: newEmail });
      
      if (!validationResult.success) {
        setError(validationResult.error.errors[0].message);
        return;
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/admins/email/1`, 
        { newEmail }
      );

      if (response.status === 200) {
        setEmail(newEmail);
        setNewEmail("");
        setEditingEmail(false);
        setSuccess('Email updated successfully');
      }
    } catch (error) {
      setError('Failed to update email');
      console.error('Error:', error);
    }
  };

  const handlePasswordChange = async () => {
    try {
      // Validate password
      const validationResult = passwordSchema.safeParse({ password: newPassword });
      
      if (!validationResult.success) {
        setError(validationResult.error.errors[0].message);
        return;
      }

      if (newPassword !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/admins/password/1`,
        { newPassword }
      );

      if (response.status === 200) {
        setNewPassword("");
        setConfirmPassword("");
        setEditingPassword(false);
        setSuccess('Password updated successfully');
      }
    } catch (error) {
      setError('Failed to update password');
      console.error('Error:', error);
    }
  };

  return (
    <div className="content-grid">
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">PENGATURAN</h2>

        {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
        {success && <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">{success}</div>}

        {/* Data Email Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Data Email</h3>
          <p className="text-gray-700">Saat Ini Email: {email}</p>

          {editingEmail ? (
            <div className="mt-4">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded"
                placeholder="Masukan email baru"
              />
              <div className="mt-2">
                <button
                  onClick={handleEmailChange}
                  className="mr-2 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Simpan
                </button>
                <button
                  onClick={() => {
                    setNewEmail("");
                    setEditingEmail(false);
                    setError("");
                  }}
                  className="inline-block px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Batal
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <button
                onClick={() => setEditingEmail(true)}
                className="inline-block px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
               Ganti Email
              </button>
            </div>
          )}
        </div>

        {/* Data Password Section */}
                  <div className="mb-6">
            <h3 className="text-lg font-semibold">Data Password</h3>

            {editingPassword ? (
              <div className="mt-4">
                <div className="relative mb-2">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded w-full pr-10"
                    placeholder="Masukkan password Baru"
                  />
                  <img
                    src={showPassword ? EyeOpen : EyeClosed}
                    alt="Toggle Password Visibility"
                    className="absolute right-3 top-3 w-5 h-5 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </div>
                <div className="relative mb-4">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded w-full pr-10"
                    placeholder="Konfirmasi password Baru"
                  />
                  <img
                    src={showConfirmPassword ? EyeOpen : EyeClosed}
                    alt="Toggle Password Visibility"
                    className="absolute right-3 top-3 w-5 h-5 cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                </div>
                <div className="mt-2">
                  <button
                    onClick={handlePasswordChange}
                    className="mr-2 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Simpan
                  </button>
                  <button
                    onClick={() => {
                      setNewPassword("");
                      setConfirmPassword("");
                      setEditingPassword(false);
                      setError("");
                    }}
                    className="inline-block px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  >
                    Batal
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4">
                <button
                  onClick={() => setEditingPassword(true)}
                  className="inline-block px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Ganti KataSandi
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default SettingsContent;