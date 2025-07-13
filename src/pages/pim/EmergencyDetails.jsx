import React, { useState, useEffect } from "react";
import { Box, Button, Grid, TextField, Typography, Stack } from "@mui/material";
import Notification from "../../components/Notification"; // Adjust the import path as necessary
import { useParams } from "react-router-dom";
import api from "../../services/api"; // Adjust the import path as necessary
import CircularProgress from "@mui/material/CircularProgress"; // Uncomment if you want to use loading spinner

const initialForm = {
  primaryName: "",
  primaryRelationship: "",
  primaryPhone: "",
  secondaryName: "",
  secondaryRelationship: "",
  secondaryPhone: "",
};

export default function EmergencyDetails() {
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

  const fetchEmployee = async () => {
    setLoading(true);
    try {
      const data = await api.getEmployeeById(id);
      const parsed = data?.emergency_contacts
        ? JSON.parse(data.emergency_contacts)
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
    if (Object.keys(errors).length > 0) {
      setErrors({});
      return;
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.primaryName) newErrors.primaryName = "Required";
    if (!form.primaryPhone) newErrors.primaryPhone = "Required";
    if (!form.primaryRelationship) newErrors.primaryRelationship = "Required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      const data = await api.updateEmployee(id, { emergency_contacts: form });
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

  if (loading) return <CircularProgress />;
  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
        Primary Contact
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{xs:12, sm:4}}>
          <TextField
            label="Name"
            name="primaryName"
            value={form.primaryName}
            onChange={handleChange}
            fullWidth
            error={!!errors.primaryName}
            helperText={errors.primaryName}
            InputProps={{ readOnly: !editModeOn }}
          />
        </Grid>
        <Grid size={{xs:12, sm:4}}>
          <TextField
            label="Relationship"
            name="primaryRelationship"
            value={form.primaryRelationship}
            onChange={handleChange}
            fullWidth
            error={!!errors.primaryRelationship}
            helperText={errors.primaryRelationship}
            InputProps={{ readOnly: !editModeOn }}
          />
        </Grid>
        <Grid size={{xs:12, sm:4}}>
          <TextField
            label="Phone"
            name="primaryPhone"
            value={form.primaryPhone}
            onChange={handleChange}
            fullWidth
            error={!!errors.primaryPhone}
            helperText={errors.primaryPhone}
            InputProps={{ readOnly: !editModeOn }}
          />
        </Grid>
      </Grid>

      <Typography variant="subtitle1" sx={{ mt: 4, mb: 1 }}>
        Secondary Contact (Optional)
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{xs:12, sm:4}}>
          <TextField
            label="Name"
            name="secondaryName"
            value={form.secondaryName}
            onChange={handleChange}
            fullWidth
            InputProps={{ readOnly: !editModeOn }}
          />
        </Grid>
        <Grid size={{xs:12, sm:4}}>
          <TextField
            label="Relationship"
            name="secondaryRelationship"
            value={form.secondaryRelationship}
            onChange={handleChange}
            fullWidth
            InputProps={{ readOnly: !editModeOn }}
          />
        </Grid>
        <Grid size={{xs:12, sm:4}}>
          <TextField
            label="Phone"
            name="secondaryPhone"
            value={form.secondaryPhone}
            onChange={handleChange}
            fullWidth
            InputProps={{ readOnly: !editModeOn }}
          />
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
            {editModeOn ? setForm(cacheForm) : null}
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
