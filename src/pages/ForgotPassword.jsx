import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../services/api";


const ForgotPassword = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitted(false);

    if (!email) {
      setError("Email is required.");
      return;
    }

    try {
      const res = await api.forgotPassword({email})
      if (res?.reset_token) {
        console.log(res, "fw")
        navigate(`/resetpassword?token=${res.reset_token}`)
      } else {
        setError("try again or contact admin")
      }
    } catch (err) {
      setError(err?.messages, "try again or contact admin")
    }
    

    // Simulate success
    setTimeout(() => {
      setSubmitted(true);
    }, 1000);
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom>
          Forgot Password
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Enter your email address or contact admin.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            type="email"
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ mb: 2 }}
          />

          <Button type="submit" variant="contained" fullWidth>
            Confirm 
          </Button>
          <Button type="button" variant="outlined" sx={{ mt: 1 }} fullWidth onClick={()=>navigate("/login")}>
            Back to login 
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ForgotPassword;
