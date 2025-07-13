import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  Avatar,
  Stack,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { ROLES, DEPARTMENTS } from "../../utils/constants"; // Adjust the import path as necessary
import { validateUserInput } from "../../utils/utils"; // Adjust the import path as necessary
import Notification from "../../components/Notification"; // Adjust the import path as necessary

export default function UserAdd() {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    department: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [notif, setNotif] = useState({open: false, severity: "error", message: ""});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" })); // Clear error on change
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with values:", formValues);
    const [isValid, errors] = validateUserInput(formValues);
    setFormErrors(errors);
    if (!isValid) return;

    // If validation passes, proceed with form submission
    try {
      const users = await api.addUser(formValues);
      setNotif({ open: true, message: users.msg || "Successfuly Added user", severity: "success" });
      navigate("/admin/user");
    } catch (err) {
      setNotif({ open: true, message: err.message || "Failed to Add user", severity: "error" });
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Add New User
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <TextField
              name="name"
              label="UserName"
              fullWidth
              value={formValues.name}
              onChange={handleChange}
              error={!!formErrors.name}
              helperText={formErrors.name}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              name="email"
              label="Email"
              fullWidth
              value={formValues.email}
              onChange={handleChange}
              error={!!formErrors.email}
              helperText={formErrors.email}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              name="phone"
              label="Phone Number"
              fullWidth
              value={formValues.phone}
              onChange={handleChange}
              error={!!formErrors.phone}
              helperText={formErrors.phone}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              select
              name="role"
              label="Role"
              fullWidth
              value={formValues.role}
              onChange={handleChange}
              error={!!formErrors.role}
              helperText={formErrors.role}
            >
              {ROLES.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              select
              name="department"
              label="Department"
              fullWidth
              value={formValues.department}
              onChange={handleChange}
              error={!!formErrors.department}
              helperText={formErrors.department}
            >
              {DEPARTMENTS.map((dept) => (
                <MenuItem key={dept} value={dept}>
                  {dept}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              name="password"
              label="Password"
              type="password"
              fullWidth
              value={formValues.password}
              onChange={handleChange}
              error={!!formErrors.password}
              helperText={formErrors.password}
            />
          </Grid>

          <Grid
            size={{ xs: 12 }}
            sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}
          >
            <Button type="submit" variant="contained">
              Save
            </Button>
            <Button variant="outlined" onClick={handleCancel}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      </form>
      <Notification
        open={notif.open}
        onClose={() => setNotif({ ...notif, open: false })}
        severity={notif.severity}
        message={notif.message}
      />
    </Paper>
  );
}
