import React from "react";
import { Box, Typography, TextField, Link } from "@mui/material";

import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { Button } from "react-bootstrap";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 3,
  borderRadius: "8px",
};

function SignupModal({ open, onClose, onLoginOpen }) {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email_id, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleLoginClick = () => {
    onClose();
    onLoginOpen();
  };

  const handleSubmit = async (e) => {
    // e.preventDefault();
    setError(() => "");
    if (!first_name || !email_id || !password || !confirm_password) {
      setError("Please fill the required details");
      return;
    } else if (password?.length < 8) {
      setError("Password must be greater than 8");
      return;
    } else if (password !== confirm_password) {
      setError("Password does not match");
      return;
    }

    const payload = {
      first_name: first_name,
      last_name: last_name,
      email_id: email_id,
      password: password,
      confirm_password: confirm_password,
    };
    setLoading(true);
    try {
      const res = await axios.post(`${process.env.REACT_APP_API}/Signup`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res?.data?.status == "true") {
        // toast.success(res?.data?.message);
        // onClose();
        setSuccess(res?.data?.message);
        setTimeout(() => handleLoginClick(), 1500);
      } else {
        // toast.error(res?.data?.message);
        setError(res?.data?.message);
      }
    } catch (error) {
      console.log(error);
      setError(error?.message);
      // toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
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
        <Modal.Title id="contained-modal-title-vcenter">Create Account</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* {error && <div className="text-danger small">{error}</div>}
        {!success && (
          <div className="text-success small my-1">
            <IoIosCheckmarkCircle />
            {success}
          </div>
        )} */}

        <Box>
          {error && <div className="text-danger small">{error}</div>}
          {success && (
            <div className="text-success small my-1">
              <IoIosCheckmarkCircle />
              {success}
            </div>
          )}
          <form>
            <Typography variant="body1" gutterBottom>
              First Name
            </Typography>
            <TextField
              label="Enter First Name"
              size="small"
              variant="outlined"
              fullWidth
              required
              // margin="normal"
              value={first_name}
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
              className="mb-3"
            />
            <Typography variant="body1" gutterBottom>
              Last Name
            </Typography>
            <TextField
              label="Enter Last Name"
              size="small"
              variant="outlined"
              fullWidth
              // margin="normal"
              value={last_name}
              onChange={(e) => {
                setLastName(e.target.value);
              }}
              className="mb-3"
            />
            <Typography variant="body1" gutterBottom>
              Phone No.
            </Typography>
            <TextField
              label="Enter Phone no."
              size="small"
              variant="outlined"
              fullWidth
              type="text"
              // margin="normal"
              // value={email_id}
              // onChange={(e) => {
              //   setEmail(e.target.value);
              // }}
              className="mb-3"
            />
            <Typography variant="body1" gutterBottom>
              Email
            </Typography>
            <TextField
              label="Enter Email"
              size="small"
              variant="outlined"
              fullWidth
              required
              // margin="normal"
              value={email_id}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className="mb-3"
            />
            <Typography variant="body1" gutterBottom>
              Password
            </Typography>
            <TextField
              label="Enter Password"
              size="small"
              variant="outlined"
              type="password"
              required
              fullWidth
              // margin="normal"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              className="mb-3"
            />
            <Typography variant="body1" gutterBottom>
              Confirm Password
            </Typography>
            <TextField
              label="Confirm Password"
              size="small"
              variant="outlined"
              type="password"
              required
              fullWidth
              // margin="small"
              value={confirm_password}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
              className="mb-3"
            />
            <div className="container my-2">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input me-2"
                  id="agree"
                  onChange={() => setAgree(!agree)}
                  checked={agree}
                />
                <label className="form-check-label small" htmlFor="agree">
                  By providing your phone number, you agree to receive text messages from healthweb.
                  Message and data rates may apply. Message frequency varies
                </label>
              </div>
            </div>
          </form>
        </Box>
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button variant="outline-danger" onClick={onClose}>
            Cancel
          </Button>
          {/* <Button disabled={!agree} variant="contained" color="primary" type="submit">
              Register
            </Button> */}
          <button
            disabled={!agree || loading}
            variant="contained"
            className="logoColorBtn px-3 rounded"
            type="button"
            onClick={() => {
              handleSubmit();
            }}
          >
            {loading ? (
              <>
                <div className="spinner-border spinner-border-sm text-light mx-3" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </>
            ) : (
              "Register"
            )}
          </button>
        </Box>
        <Box mt={2} display="flex" justifyContent="space-between">
          <Typography variant="body2">
            Already have an account?{" "}
            <Link href="#" variant="body2" onClick={handleLoginClick}>
              Login here
            </Link>
          </Typography>
        </Box>
      </Modal.Body>
      {/* <Modal.Footer></Modal.Footer> */}
    </Modal>
    // <Modal open={open} onClose={onClose}>
    //   <Box className="signup-box">
    //     <Typography variant="h6" component="h2" gutterBottom>
    //       Create Account
    //     </Typography>
    //     {error && <div className="text-danger small">{error}</div>}
    //     {success && (
    //       <div className="text-success small my-1">
    //         <IoIosCheckmarkCircle />
    //         {success}
    //       </div>
    //     )}
    //     <form>
    //       <Typography variant="body1" gutterBottom>
    //         First Name
    //       </Typography>
    //       <TextField
    //         label="Enter First Name"
    //         size="small"
    //         variant="outlined"
    //         fullWidth
    //         required
    //         // margin="normal"
    //         value={first_name}
    //         onChange={(e) => {
    //           setFirstName(e.target.value);
    //         }}
    //         className="mb-3"
    //       />
    //       <Typography variant="body1" gutterBottom>
    //         Last Name
    //       </Typography>
    //       <TextField
    //         label="Enter Last Name"
    //         size="small"
    //         variant="outlined"
    //         fullWidth
    //         // margin="normal"
    //         value={last_name}
    //         onChange={(e) => {
    //           setLastName(e.target.value);
    //         }}
    //         className="mb-3"
    //       />
    //       <Typography variant="body1" gutterBottom>
    //         Phone No.
    //       </Typography>
    //       <TextField
    //         label="Enter Phone no."
    //         size="small"
    //         variant="outlined"
    //         fullWidth
    //         type="text"
    //         // margin="normal"
    //         // value={email_id}
    //         // onChange={(e) => {
    //         //   setEmail(e.target.value);
    //         // }}
    //         className="mb-3"
    //       />
    //       <Typography variant="body1" gutterBottom>
    //         Email
    //       </Typography>
    //       <TextField
    //         label="Enter Email"
    //         size="small"
    //         variant="outlined"
    //         fullWidth
    //         required
    //         // margin="normal"
    //         value={email_id}
    //         onChange={(e) => {
    //           setEmail(e.target.value);
    //         }}
    //         className="mb-3"
    //       />
    //       <Typography variant="body1" gutterBottom>
    //         Password
    //       </Typography>
    //       <TextField
    //         label="Enter Password"
    //         size="small"
    //         variant="outlined"
    //         type="password"
    //         required
    //         fullWidth
    //         // margin="normal"
    //         value={password}
    //         onChange={(e) => {
    //           setPassword(e.target.value);
    //         }}
    //         className="mb-3"
    //       />
    //       <Typography variant="body1" gutterBottom>
    //         Confirm Password
    //       </Typography>
    //       <TextField
    //         label="Confirm Password"
    //         size="small"
    //         variant="outlined"
    //         type="password"
    //         required
    //         fullWidth
    //         // margin="small"
    //         value={confirm_password}
    //         onChange={(e) => {
    //           setConfirmPassword(e.target.value);
    //         }}
    //         className="mb-3"
    //       />
    //       <div className="container my-2">
    //         <div className="form-check">
    //           <input
    //             type="checkbox"
    //             className="form-check-input me-2"
    //             id="agree"
    //             onChange={() => setAgree(!agree)}
    //             checked={agree}
    //           />
    //           <label className="form-check-label small" htmlFor="agree">
    //             By providing your phone number, you agree to receive text messages from healthweb.
    //             Message and data rates may apply. Message frequency varies
    //           </label>
    //         </div>
    //       </div>
    //       <Box mt={2} display="flex" justifyContent="space-between">
    //         <Button variant="outline-danger" onClick={onClose}>
    //           Cancel
    //         </Button>
    //         {/* <Button disabled={!agree} variant="contained" color="primary" type="submit">
    //           Register
    //         </Button> */}
    //         <button
    //           disabled={!agree || loading}
    //           variant="contained"
    //           className="logoColorBtn px-3 rounded"
    //           type="button"
    //           onClick={() => {
    //             handleSubmit();
    //           }}
    //         >
    //           {loading ? (
    //             <>
    //               <div className="spinner-border spinner-border-sm text-light mx-3" role="status">
    //                 <span className="sr-only">Loading...</span>
    //               </div>
    //             </>
    //           ) : (
    //             "Register"
    //           )}
    //         </button>
    //       </Box>
    //     </form>
    //     <Box mt={2} display="flex" justifyContent="space-between">
    //       <Typography variant="body2">
    //         Already have an account?{" "}
    //         <Link href="#" variant="body2" onClick={handleLoginClick}>
    //           Login here
    //         </Link>
    //       </Typography>
    //     </Box>
    //   </Box>
    // </Modal>
  );
}

export default SignupModal;
