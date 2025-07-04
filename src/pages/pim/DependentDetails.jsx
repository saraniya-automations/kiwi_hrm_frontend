import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
  Stack,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import Notification from "../../components/Notification"; // Adjust the import path as necessary
import { useParams } from "react-router-dom";
import api from "../../services/api"; // Adjust the import path as necessary
import CircularProgress from "@mui/material/CircularProgress"; // Uncomment if you want to use loading spinner

const defaultDependent = {
  name: "",
  relationship: "",
  dob: "",
};

export default function DependentDetails() {
  const { id } = useParams();
  const [dependents, setDependents] = useState([defaultDependent]);
  const [errors, setErrors] = useState([]);
  const [editModeOn, setEditModeOn] = useState(false); // Edit mode state
  const [notif, setNotif] = useState({
    open: false,
    severity: "error",
    message: "",
  }); // Notification state
  const [loading, setLoading] = useState(false); // Loading state

  const fetchEmployee = async () => {
    setLoading(true);
    try {
      const data = await api.getEmployeeById(id);
      const parsed = data?.dependents ? JSON.parse(data.dependents) : [];
      parsed.length > 0 && setDependents(Array.isArray(parsed) ? parsed : []);
    } catch (err) {
      console.error("Error fetching employee data:", err);
      setNotif({
        open: true,
        message: err.message || "Failed to Fetch Profile",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...dependents];
    updated[index][name] = value;
    setDependents(updated);
  };

  const handleAddDependent = () => {
    setDependents([...dependents, { ...defaultDependent }]);
    setErrors([...errors, {}]);
  };

  const handleRemoveDependent = (index) => {
    const updated = dependents.filter((_, i) => i !== index);
    const updatedErrors = errors.filter((_, i) => i !== index);
    setDependents(updated);
    setErrors(updatedErrors);
  };

  const validate = () => {
    const newErrors = dependents.map((dep) => {
      const e = {};
      if (!dep.name) e.name = "Name is required";
      if (!dep.relationship) e.relationship = "Relationship is required";
      if (!dep.dob) e.dob = "Date of birth is required";
      return e;
    });
    setErrors(newErrors);
    return newErrors.every((e) => Object.keys(e).length === 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const data = await api.updateEmployee(id, { dependents: dependents });
      setNotif({
        open: true,
        message: data.message || "Successfuly Updated Profile",
        severity: "success",
      });
    } catch (err) {
      setNotif({
        open: true,
        message: err.message || "Failed to Updated Profile",
        severity: "error",
      });
    } finally {
      setEditModeOn(false);
      setLoading(false); // Exit edit mode after saving
    }
  };

  if (loading) return <CircularProgress />;
  return (
    <Box component="form" onSubmit={handleSubmit}>
      {dependents.map((dep, index) => (
        <Box
          key={index}
          sx={{
            border: "1px solid #ddd",
            borderRadius: 2,
            p: 2,
            mb: 2,
            position: "relative",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Name"
                name="name"
                fullWidth
                value={dep.name}
                onChange={(e) => handleChange(index, e)}
                error={!!errors[index]?.name}
                helperText={errors[index]?.name}
                InputProps={{ readOnly: !editModeOn }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Relationship"
                name="relationship"
                fullWidth
                value={dep.relationship}
                onChange={(e) => handleChange(index, e)}
                error={!!errors[index]?.relationship}
                helperText={errors[index]?.relationship}
                InputProps={{ readOnly: !editModeOn }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Date of Birth"
                name="dob"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={dep.dob}
                onChange={(e) => handleChange(index, e)}
                error={!!errors[index]?.dob}
                helperText={errors[index]?.dob}
                InputProps={{ readOnly: !editModeOn }}
              />
            </Grid>
          </Grid>

          {(editModeOn && dependents.length > 1) && (
            <IconButton
              onClick={() => handleRemoveDependent(index)}
              sx={{ position: "absolute", top: 8, right: 8 }}
              aria-label="delete"
              color="error"
            >
              <Delete />
            </IconButton>
          )}
        </Box>
      ))}

      <Stack direction="row" spacing={2} justifyContent="flex-end" mt={4}>
        {editModeOn && (
          <>
            <Button variant="outlined" onClick={handleAddDependent}>
              Add Dependent
            </Button>
            <Button type="submit" variant="contained">
              Save
            </Button>
          </>
        )}
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setEditModeOn(!editModeOn)}
        >
          {editModeOn ? "Cancel Edit" : "Edit"}
        </Button>
      </Stack>

      <Notification
        open={notif.open}
        onClose={() => setNotif({ ...notif, open: false })}
        severity={notif.severity}
        message={notif.message}
      />
    </Box>
  );
}
