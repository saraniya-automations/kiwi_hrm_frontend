import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  Button,
  Typography,
  Paper,
  Stack,
} from "@mui/material";
import Notification from "../../components/Notification"; // Adjust the import path as necessary
import { useParams } from "react-router-dom";
import api from "../../services/api"; // Adjust the import path as necessary
import CircularProgress from "@mui/material/CircularProgress"; // Uncomment if you want to use loading spinner
import { EMP_STATUS, JOB_TITLE, DEPARTMENTS, NATIONALITIES} from "../../utils/constants"

const initialForm = {
  jobTitle: "",
  employmentStatus: "",
  jobCategory: "",
  location: "",
  startDate: "",
  endDate: "",
};

export default function JobDetails() {
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

  const fetchEmployee = async () => {
    setLoading(true);
    try {
      const data = await api.getEmployeeById(id);
      const parsed = data?.job_details ? JSON.parse(data.job_details) : {};

      setForm((prev) => ({
        ...prev,
        ...parsed,
      }));
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
    const errs = {};
    if (!form.jobTitle) errs.jobTitle = "Job title is required";
    if (!form.employmentStatus) errs.employmentStatus = "Status is required";
    if (!form.jobCategory) errs.jobCategory = "Category is required";
    if (!form.startDate) errs.startDate = "Start date is required";
    return errs;
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
      const data = await api.updateEmployee(id, { job_details: form });
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
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Job Title"
            name="jobTitle"
            fullWidth
            select
            value={form.jobTitle}
            onChange={handleChange}
            error={!!errors.jobTitle}
            helperText={errors.jobTitle}
            InputProps={{ readOnly: !editModeOn }}
          >
            {JOB_TITLE.map((title) => (
              <MenuItem key={title} value={title}>
                {title}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Employment Status"
            name="employmentStatus"
            fullWidth
            select
            value={form.employmentStatus}
            onChange={handleChange}
            error={!!errors.employmentStatus}
            helperText={errors.employmentStatus}
            InputProps={{ readOnly: !editModeOn }}
          >
            {EMP_STATUS.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Job Category"
            name="jobCategory"
            fullWidth
            select
            value={form.jobCategory}
            onChange={handleChange}
            error={!!errors.jobCategory}
            helperText={errors.jobCategory}
            InputProps={{ readOnly: !editModeOn }}
          >
            {DEPARTMENTS.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Location"
            name="location"
            fullWidth
            select
            value={form.location}
            onChange={handleChange}
            InputProps={{ readOnly: !editModeOn }}
          >
            {NATIONALITIES.map((loc) => (
              <MenuItem key={loc} value={loc}>
                {loc}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Start Date"
            name="startDate"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={form.startDate}
            onChange={handleChange}
            error={!!errors.startDate}
            helperText={errors.startDate}
            InputProps={{ readOnly: !editModeOn }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="End Date"
            name="endDate"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={form.endDate}
            onChange={handleChange}
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
