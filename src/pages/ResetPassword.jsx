import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Alert,
} from "@mui/material";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing token.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!password || !confirmPassword) {
      return setError("All fields are required.");
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    try {
      console.log("Resetting password with token:", token);
      const res = await api.resetPassword({ token, new_password: password });
      if (res.message) {
        setSuccess(res.message || "Your password has been reset successfully!");
        navigate("/login");
      } else {
        setPassword("");
        setConfirmPassword("");
        setError("try again");
      }
      console.log(res.message);
    } catch (err) {
      setError("Failed to reset password.");
      setPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom>
          Reset Password
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            type="password"
            label="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            fullWidth
            type="password"
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{ mb: 2 }}
            required
          />

          <Button type="submit" variant="contained" fullWidth disabled={!token}>
            Reset Password
          </Button>
          <Button
            type="button"
            variant="outlined"
            sx={{ mt: 1 }}
            fullWidth
            onClick={() => navigate("/login")}
          >
            Back to login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ResetPassword;
