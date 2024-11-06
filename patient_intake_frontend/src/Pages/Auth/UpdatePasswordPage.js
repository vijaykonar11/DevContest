// UpdatePasswordPage.js
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { toast } from "react-toastify";
import { Typography, TextField, Button, Box } from "@mui/material";
import { IoIosCheckmarkCircle } from "react-icons/io";

const UpdatePassword = () => {
  const location = useLocation();
  const { email } = location.state || {};
  //   const [email, setEmail] = useState('');
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

  // console.log(userEmail,"userEmailuserEmailuserEmail")
  const navigate = useNavigate();
  const handleChangePassword = async () => {
    setSuccess("");
    setError("");
    if (!newPassword || !confirmNewPassword) {
      setError("Please fill required details!");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match!");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API}/newchangepassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_id: email,
          new_password: newPassword,
          confirm_new_password: confirmNewPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        //setMessage('Password changed successfully');
        // toast.success("Password changed successfully");
        navigate("/");

        // Optionally, you can redirect or handle success in UI
      } else {
        // setMessage(data.message || 'Password change failed');
        // toast.error(data.message || "Password change failed");
      }
    } catch (error) {
      //   setMessage('Error occurred during password change');
      // toast.error("Error occurred during password change");
      console.error("Error during password change:", error);
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
            Change Password
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
              value={email}
              disabled
              //   onChange={(e) => setEmail(e.target.value)}
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
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleChangePassword}
              style={{ marginTop: "1rem" }}
            >
              Change Password
            </Button>
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

export default UpdatePassword;
