// ChangePasswordPage.js
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Typography, TextField, Box } from "@mui/material";
import { IoIosCheckmarkCircle } from "react-icons/io";

const ChangePassword = () => {
  const location = useLocation();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const storedData = localStorage.getItem("userData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setUserEmail(parsedData?.data);
    }
  }, [location]);

  const handleChangePassword = async () => {
    setSuccess("");
    setError("");
    if (!newPassword || !confirmNewPassword || !oldPassword) {
      setError("Please fill required details!");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match!");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API}/changepassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_id: userEmail?.email_id,
          old_password: oldPassword,
          new_password: newPassword,
          confirm_new_password: confirmNewPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Password changed successfully");
        setMessage("");
        setNewPassword("");
        setConfirmNewPassword("");
        setOldPassword("");
      } else {
        setMessage(data.message || "Password change failed");
        setError(data?.message);
      }
    } catch (error) {
      console.log(error);
      setError(error?.repsonse?.data?.message);
      setMessage("Error occurred during password change");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ paddingTop: "3rem" }}
      >
        <Box sx={{ width: "100%", maxWidth: 400, marginBottom: "2rem" }}>
          <Typography variant="h4" gutterBottom align="center">
            Update Password
          </Typography>
          {success && (
            <div className="text-success small my-2">
              <IoIosCheckmarkCircle />
              {success}
            </div>
          )}
          <Box sx={{ maxWidth: 400 }}>
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={userEmail?.email_id}
              disabled
              //   onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Old Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <TextField
              label="New Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <TextField
              label="Confirm New Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />

            {error && <div className="text-danger small">{error}</div>}
            <button
              // color="info"
              className="logoColorBtn px-3 py-2 w-100 rounded"
              fullWidth
              onClick={handleChangePassword}
              style={{ marginTop: "1rem" }}
              disabled={loading}
            >
              {loading ? (
                <div className="spinner-border spinner-border-sm text-light" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              ) : (
                "Change Password"
              )}
            </button>
            {message && (
              <Typography variant="body1" style={{ marginTop: "1rem", textAlign: "center" }}>
                {message}
              </Typography>
            )}
          </Box>
        </Box>
      </div>
    </>
  );
};

export default ChangePassword;
