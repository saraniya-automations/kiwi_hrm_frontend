import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  MenuItem,
  Avatar,
  Button,
  Stack,
  Box,
} from "@mui/material";
import { useParams } from "react-router-dom";
import api from "../../services/api"; // Adjust the import path as necessary
import Notification from "../../components/Notification"; // Adjust the import path as necessary
import CircularProgress from "@mui/material/CircularProgress";

const genders = ["Male", "Female", "Other"];
const maritalStatuses = ["Single", "Married", "Divorced"];
const nationalities = ["New Zealand", "Australian", "Sri Lanka", "Other"];

export default function PersonalDetails() {
  const { id } = useParams();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
    maritalStatus: "",
    nationality: "",
    image: null,
  });
  const [errors, setErrors] = useState({}); // Form validation errors
  const [loading, setLoading] = useState(false); // Loading state
  const [employeeInfo, setEmployeeInfo] = useState({}); // Personal info state
  const [image, setImage] = useState(null); // Image state
  const [editModeOn, setEditModeOn] = useState(false); // Edit mode state
  const [notif, setNotif] = useState({
    open: false,
    severity: "error",
    message: "",
  }); // Notification state

  const validate = () => {
    const newErrors = {};
    if (!form.firstName) newErrors.firstName = "Required";
    if (!form.lastName) newErrors.lastName = "Required";
    if (!form.gender) newErrors.gender = "Required";
    if (!form.dob) newErrors.dob = "Required";
    if (!form.maritalStatus) newErrors.maritalStatus = "Required";
    if (!form.nationality) newErrors.nationality = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchEmployee = async () => {
    setLoading(true);
    try {
      const data = await api.getEmployeeById(id);
      const parsed = data?.personal_details
        ? JSON.parse(data.personal_details)
        : {};

      setForm((prev) => ({
        ...prev,
        ...parsed,
      }));
      // console.log("Fetched employee data:", data);
      // setEmployeeInfo(data ? JSON.parse(data) : {});
    } catch (err) {
      console.error("Error fetching employee data:", err);
      setNotif({ open: true, message: err.message || "Failed to Fetch Profile", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result;
      setForm({ ...form, image: base64String});
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const data = await api.updateEmployee(id, {personal_details: form});
      setNotif({ open: true, message: data.message || "Successfuly Updated Profile", severity: "success" });
    } catch (err) {
      setNotif({ open: true, message: err.message || "Failed to Updated Profile", severity: "error" });
    } finally {
      setEditModeOn(false);
      setLoading(false); // Exit edit mode after saving
    }
  };

  if (loading) return <CircularProgress />;
  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={2} alignItems="center" mb={3}>
        <Avatar src={form.image} sx={{ width: 80, height: 80 }} />
        <Button component="label" variant="outlined">
          Upload Image
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageChange}
          />
        </Button>
      </Stack>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <TextField
            label="Employee ID"
            name="empId"
            fullWidth
            value={id}
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="First Name"
            name="firstName"
            fullWidth
            value={form.firstName}
            onChange={handleChange}
            error={!!errors.firstName}
            helperText={errors.firstName}
            InputProps={{ readOnly: !editModeOn }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Last Name"
            name="lastName"
            fullWidth
            value={form.lastName}
            onChange={handleChange}
            error={!!errors.lastName}
            helperText={errors.lastName}
            InputProps={{ readOnly: !editModeOn }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            select
            label="Gender"
            name="gender"
            fullWidth
            value={form.gender}
            onChange={handleChange}
            error={!!errors.gender}
            helperText={errors.gender}
            InputProps={{ readOnly: !editModeOn }}
          >
            {genders.map((g) => (
              <MenuItem key={g} value={g}>
                {g}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            type="date"
            label="Date of Birth"
            name="dob"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={form.dob}
            onChange={handleChange}
            error={!!errors.dob}
            helperText={errors.dob}
            InputProps={{ readOnly: !editModeOn }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            select
            label="Marital Status"
            name="maritalStatus"
            fullWidth
            value={form.maritalStatus}
            onChange={handleChange}
            error={!!errors.maritalStatus}
            helperText={errors.maritalStatus}
            InputProps={{ readOnly: !editModeOn }}
          >
            {maritalStatuses.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            select
            label="Nationality"
            name="nationality"
            fullWidth
            value={form.nationality}
            onChange={handleChange}
            error={!!errors.nationality}
            helperText={errors.nationality}
            InputProps={{ readOnly: !editModeOn }}
          >
            {nationalities.map((n) => (
              <MenuItem key={n} value={n}>
                {n}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      <Stack direction="row" spacing={2} justifyContent="flex-end" mt={4}>
        {editModeOn && (
          <Button type="submit" variant="contained">
            Save
          </Button>
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
