import React, { useState } from "react";
import { Box, Typography, TextField, Link } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { Button, Modal } from "react-bootstrap";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "8px",
};

function ForgotPasswordModal({ open, onClose, onRegisterOpen, onLoginOpen }) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpState, setOtpState] = useState("EMAIL_INPUT");
  const [newValue, setNewValue] = useState({ password: "", confirm_password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    setError("");
    if (!email) {
      setError("Please enter email first!");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/forgotpassword`,
        { email_id: email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res?.data?.status === "true") {
        // toast.success(res?.data?.message);
        setSuccess(res?.data?.message);
        setOtpState("OTP_INPUT");
      } else {
        // toast.error(res?.data?.message);
        setError(res?.data?.message);
      }
    } catch (error) {
      console.log(error);
      setError(error?.response?.data?.error);
      // toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setSuccess("");
    setError("");
    if (otp.length !== 6) {
      setError("Please enter valid otp!");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/verifyotp`,
        { email_id: email, otp: otp },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res?.data?.status === "true") {
        // toast.success("OTP has been verified successfully");
        // onClose();
        setSuccess(res?.data?.message);
        setOtpState("PASSWORD_INPUT");
      } else {
        setError(res?.data?.message);
        // toast.error(res?.data?.message);
      }
    } catch (error) {
      console.log(error);
      setError(error?.response?.data?.error);
      // toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setSuccess("");
    setError("");
    if (!newValue.password || !newValue.confirm_password) {
      setError("Please fill required details!");
      return;
    }
    if (newValue.password !== newValue.confirm_password) {
      setError("Passwords do not match!");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/newchangepassword `,
        {
          email_id: email,
          new_password: newValue.password,
          confirm_new_password: newValue.confirm_password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res?.data?.status === "true") {
        // toast.success("OTP has been verified successfully");
        // onClose();
        setEmail("");
        setSuccess("");
        setError("");
        setTimeout(() => {
          onClose();
          setOtpState("EMAIL_INPUT");
          onLoginOpen();
        }, 1000);
        setSuccess(res?.data?.message);
      } else {
        // toast.error(res?.data?.message);
        setError(res?.data?.message);
      }
    } catch (error) {
      console.log(error);
      setError(error?.response?.data?.message);
      // toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = () => {
    onClose();
    onRegisterOpen();
  };

  return (
    <Modal
      show={open}
      onHide={onClose}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Forgot Password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Box>
          {success && (
            <div className="text-success small my-2">
              <IoIosCheckmarkCircle />
              {success}
            </div>
          )}
          {otpState !== "PASSWORD_INPUT" ? (
            <>
              <TextField
                label="Enter Email"
                variant="outlined"
                fullWidth
                disabled={otpState !== "EMAIL_INPUT"}
                margin="normal"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              {otpState === "OTP_INPUT" && (
                <TextField
                  label="Enter OTP"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={otp}
                  // numInputs={6}
                  // Separator={<span>-</span>}
                  // onChange={setOtp}
                  // inputStyle={{
                  //     width: '2.5rem',
                  //     height: '2.5rem',
                  //     margin: '0 0.5rem',
                  //     fontSize: '1.5rem',
                  //     borderRadius: '4px',
                  //     border: '1px solid rgba(0,0,0,0.3)' }}
                  onChange={(e) => {
                    setOtp(e.target.value);
                  }}
                />
              )}
            </>
          ) : (
            <>
              <TextField
                label="Enter new password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={newValue.password}
                onChange={(e) => {
                  setNewValue({ ...newValue, password: e.target.value });
                }}
              />
              <TextField
                label="Re-Enter password"
                variant="outlined"
                type="password"
                fullWidth
                margin="normal"
                value={newValue.confirm_password}
                onChange={(e) => {
                  setNewValue({ ...newValue, confirm_password: e.target.value });
                }}
              />
            </>
          )}
          {error && <div className="text-danger small">{error}</div>}
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button variant="outline-danger" onClick={onClose}>
              Cancel
            </Button>
            <button
              className="logoColorBtn px-3 rounded"
              disabled={loading}
              onClick={
                otpState === "EMAIL_INPUT"
                  ? handleSendOtp
                  : otpState === "OTP_INPUT"
                  ? handleVerifyOtp
                  : handleChangePassword
              }
            >
              {loading ? (
                <div className="spinner-border spinner-border-sm text-light mx-3" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              ) : otpState === "EMAIL_INPUT" ? (
                "Send"
              ) : otpState === "OTP_INPUT" ? (
                "Verify"
              ) : (
                "Submit"
              )}
            </button>
          </Box>

          <Box mt={2} display="flex" justifyContent="space-between">
            <Typography variant="body2">
              Don't have an account?{" "}
              <Link href="#" variant="body2" onClick={handleRegisterClick}>
                Register here
              </Link>
            </Typography>
          </Box>
        </Box>
      </Modal.Body>
    </Modal>
  );
}

export default ForgotPasswordModal;
