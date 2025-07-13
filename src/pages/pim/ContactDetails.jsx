// src/pages/Contact.jsx
import { Box, Button, Grid, MenuItem, Stack, TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import Notification from "../../components/Notification"; // Adjust the import path as necessary
import { useParams } from "react-router-dom";
import api from "../../services/api"; // Adjust the import path as necessary
// import CircularProgress from "@mui/material/CircularProgress"; // Uncomment if you want to use loading spinner

const initialForm = {
  phone: "",
  email: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  country: "",
};

export default function ContactDetails() {
  const { id } = useParams();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [editModeOn, setEditModeOn] = useState(false); // Edit mode state
  const [notif, setNotif] = useState({
    open: false,
    severity: "error",
    message: "",
  }); // Notification state
  const [loading, setLoading] = useState(false); // Loading state
  const [cacheForm, setCacheForm] = useState(initialForm);

  const countries = ["New Zealand", "Australia", "Sri Lanka", "Others"];

  const fetchEmployee = async () => {
    setLoading(true);
    try {
      const data = await api.getEmployeeById(id);
      const parsed = data?.contact_details
        ? JSON.parse(data.contact_details)
        : {};

      setForm((prev) => ({
        ...prev,
        ...parsed,
      }));
      setCacheForm(parsed)
      // console.log("Fetched employee data:", data);
      // setEmployeeInfo(data ? JSON.parse(data) : {});
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.phone) newErrors.phone = "Phone is required";
    if (!form.email) newErrors.email = "Email is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    try {
      // const updatedForm = { ...employeeInfo, personal_details: form };
      const data = await api.updateEmployee(id, { contact_details: form });
      setCacheForm(form)
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

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            name="phone"
            label="Phone Number"
            fullWidth
            value={form.phone}
            onChange={handleChange}
            error={!!errors.phone}
            helperText={errors.phone}
            InputProps={{ readOnly: !editModeOn }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            name="email"
            label="Email Address"
            fullWidth
            value={form.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            InputProps={{ readOnly: !editModeOn }}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            name="address"
            label="Address"
            fullWidth
            multiline
            rows={2}
            value={form.address}
            onChange={handleChange}
            error={!!errors.address}
            helperText={errors.address}
            InputProps={{ readOnly: !editModeOn }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            name="city"
            label="City"
            fullWidth
            value={form.city}
            onChange={handleChange}
            InputProps={{ readOnly: !editModeOn }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            name="state"
            label="State/Province"
            fullWidth
            value={form.state}
            onChange={handleChange}
            InputProps={{ readOnly: !editModeOn }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            name="zip"
            label="ZIP Code"
            fullWidth
            value={form.zip}
            onChange={handleChange}
            InputProps={{ readOnly: !editModeOn }}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            name="country"
            label="Country"
            select
            fullWidth
            value={form.country}
            onChange={handleChange}
            InputProps={{ readOnly: !editModeOn }}
          >
            {countries.map((country) => (
              <MenuItem key={country} value={country}>
                {country}
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
          onClick={() => {
            setEditModeOn(!editModeOn)
            editModeOn && setForm(cacheForm)
          }}
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
