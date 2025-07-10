// src/pages/admin/UserEdit.jsx
import {
  Button,
  CircularProgress,
  Grid,
  MenuItem,
  Paper,
  TextField,
  Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import { DEPARTMENTS, ROLES, STATUS } from "../../utils/constants"; // Adjust the import path as necessary
import { validateUserInput } from "../../utils/utils"; // Adjust the import path as necessary

const initialUserState = {
  name: "",
  email: "",
  phone: "",
  role: "",
  department: "",
  status: "Active", // Default status 
}

export default function UserEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(initialUserState);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.getUserById(id);
        const filtered = Object.keys(initialUserState).reduce((acc, key) => {
          acc[key] = data[key] ?? "";
          return acc;
        }, {});
        setUser(filtered);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const [isValid, errors] = validateUserInput(user, true); // Pass true for update validation
    console.log("Validation result:", isValid, errors);
    setFormErrors(errors);
    if (!isValid) return;

    console.log("Submitting user data:", user);
    try {
      await api.updateUser(id, user);
      navigate("/admin/user");
    } catch (err) {
      console.error("Update failed:", err.message);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Paper sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h6" gutterBottom>
        Edit User
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              name="name"
              label="User Name"
              fullWidth
              value={user?.name || ""}
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
              value={user?.email}
              error={!!formErrors.email}
              helperText={formErrors.email}
              InputProps={{ readOnly: true }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              name="phone"
              label="Phone"
              fullWidth
              value={user?.phone}
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
              value={user?.role}
              onChange={handleChange}
              error={!!formErrors.role}
              helperText={formErrors.role}
            >
              {ROLES.map((r) => (
                <MenuItem key={r} value={r}>
                  {r}
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
              value={user?.department}
              onChange={handleChange}
              error={!!formErrors.department}
              helperText={formErrors.department}
            >
              {DEPARTMENTS.map((d) => (
                <MenuItem key={d} value={d}>
                  {d}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              select
              name="status"
              label="Status"
              fullWidth
              value={user?.status}
              onChange={handleChange}
              error={!!formErrors.status}
              helperText={formErrors.status}
            >
              {STATUS.map((d) => (
                <MenuItem key={d} value={d}>
                  {d}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid
            size={{ xs: 12 }}
            sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}
          >
            <Button type="submit" variant="contained">
              Update
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}
