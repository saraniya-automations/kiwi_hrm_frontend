// src/pages/admin/UserEdit.jsx
import {
  Box,
  Button,
  Grid,
  MenuItem,
  Paper,
  TextField,
  Typography,
  CircularProgress,
  Avatar,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { ROLES, DEPARTMENTS } from "../../utils/constants"; // Adjust the import path as necessary
import { validateUserInput } from "../../utils/utils"; // Adjust the import path as necessary

export default function UserEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await api.getUserById(id);
        setUser(data);
        setPreview(data.imageUrl || null);
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
    const [isValid, errors] = validateUserInput(user);
    setFormErrors(errors);
    if (!isValid) return;

    const formData = new FormData();
    Object.entries(user).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        formData.append(key, val);
      }
    });

    try {
      await api.updateUser(id, formData);
      navigate("/admin");
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
        {user && Object.keys(user).length > 0 ? (
            <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  name="name"
                  label="User Name"
                  fullWidth
                  value={user.name || ""}
                  onChange={handleChange}
                  error={!!formErrors.name}
                  helperText={formErrors.name}
                />
              </Grid>
    
              <Grid item xs={12} sm={6}>
                <TextField
                  name="email"
                  label="Email"
                  fullWidth
                  value={user.email}
                  error={!!formErrors.email}
                  helperText={formErrors.email}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
    
              <Grid item xs={12} sm={6}>
                <TextField
                  name="phone"
                  label="Phone"
                  fullWidth
                  value={user.phone}
                  onChange={handleChange}
                  error={!!formErrors.phone}
                  helperText={formErrors.phone}
                />
              </Grid>
    
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  name="role"
                  label="Role"
                  fullWidth
                  value={user.role}
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
    
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  name="department"
                  label="Department"
                  fullWidth
                  value={user.department}
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
    
              <Grid item xs={12} sx={{ display: "flex", gap: 2 }}>
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
        ) : (
          <Typography variant="body1" color="error">
            User not found.
          </Typography>
        )}
      
    </Paper>
  );
}
