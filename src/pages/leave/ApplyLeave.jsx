import React, { useState } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Grid,
  Typography,
  Paper,
} from "@mui/material";
import { LEAVE_TYPES } from "../../utils/constants"; // Adjust the import path as necessary
import Notification from "../../components/Notification";
import api from "../../services/api"; // Adjust the import path as necessary

const initialFormState = {
  type: "",
  startDate: "",
  endDate: "",
  reason: "",
};

export default function ApplyLeave({ onSubmit }) {
  const [form, setForm] = useState(initialFormState);
  const [notif, setNotif] = useState({
    open: false,
    severity: "error",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.type || !form.startDate || !form.endDate || !form.reason) {
      alert("Please fill all fields");
      return;
    }
    try {
      // Prepare the leave request payload
      const leaveRequest = {
        leave_type: form.type,
        start_date: form.startDate,
        end_date: form.endDate,
        reason: form.reason,
      };
      const res = await api.applyLeave(leaveRequest); // Assuming you have an API service to handle leave requests

      setNotif({
        open: true,
        severity: "success",
        message: "Leave request submitted successfully",
      });

      setForm(initialFormState); // Reset form after submission
      if (onSubmit) onSubmit(); // Call onSubmit callback if provided
    } catch (error) {
      console.error("Error submitting leave request:", error);
      // Handle error (e.g., show notification)
      setNotif({
        open: true,
        severity: "error",
        message: error?.error|| "Failed to submit leave request",
      });
    }
  };

  const handleCancel = () => {
    setForm(initialFormState); // Reset form
  };

  return (
    <Paper sx={{ p: 4, mb: 4 }}>
      <Typography variant="h6">Apply for Leave</Typography>
      <Box component="form" mt={2} onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              select
              fullWidth
              label="Leave Type"
              name="type"
              value={form.type}
              onChange={handleChange}
              required
            >
              {LEAVE_TYPES.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="Start Date"
              name="startDate"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={form.startDate}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="End Date"
              name="endDate"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={form.endDate}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Reason"
              name="reason"
              value={form.reason}
              onChange={handleChange}
              required
            />
          </Grid>
        </Grid>
        <Box
          size={{ xs: 12 }}
          sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 3 }}
        >
          <Button type="submit" variant="contained">
            Apply
          </Button>
          <Button variant="outlined" onClick={handleCancel}>
            Cancel
          </Button>
        </Box>
      </Box>
      <Notification
        open={notif.open}
        onClose={() => setNotif({ ...notif, open: false })}
        severity={notif.severity}
        message={notif.message}
      />
    </Paper>
  );
}
