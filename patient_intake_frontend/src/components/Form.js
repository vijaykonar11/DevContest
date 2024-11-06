import React from "react";
import { Box, Checkbox, FormControlLabel, TextField, Typography } from "@mui/material";
import "../styles/Form.css";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
const Form = () => {
  return (
    <>
      <Box component="form" className="form-container">
        <Typography variant="h4" component="h1" gutterBottom className="form-title">
          Interested in Health Web Medical AI Scribe?
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom className="form-subtitle">
          Start your conversation
        </Typography>
        <Box className="form-row">
          <TextField
            required
            label="First Name"
            variant="outlined"
            margin="normal"
            className="form-field"
            style={{ width: "50%" }}
          />
          <TextField
            required
            label="Last Name"
            variant="outlined"
            margin="normal"
            className="form-field"
            style={{ width: "50%" }}
          />
        </Box>
        <TextField
          required
          label="Work Email"
          variant="outlined"
          margin="normal"
          fullWidth
          className="form-field"
        />
        <TextField
          required
          label="Phone Number"
          variant="outlined"
          margin="normal"
          fullWidth
          className="form-field"
        />
        <FormControlLabel
          control={<Checkbox name="textCommunication" className="form-checkbox" />}
          label="Do You Prefer to Communicate via Text?"
          className="form-checkbox-label"
        />
        <TextField
          required
          label="Name of Your Organization"
          variant="outlined"
          margin="normal"
          fullWidth
          className="form-field"
        />
        <TextField
          required
          label="What EHR are You Using?"
          variant="outlined"
          margin="normal"
          fullWidth
          className="form-field"
        />
        <TextField
          required
          label="Number of Providers"
          variant="outlined"
          margin="normal"
          fullWidth
          className="form-field"
        />
        <TextField
          required
          label="ZIP Code"
          variant="outlined"
          margin="normal"
          fullWidth
          className="form-field"
        />
        <Typography variant="body2" align="center" className="form-privacy mt-2 mb-3">
          Your privacy is important to us. <Link to="/privacy-policy">Privacy Policy</Link>
        </Typography>
        <Button variant="contained" type="submit" className="btnSuccess w-25">
          Submit
        </Button>
      </Box>
    </>
  );
};

export default Form;
