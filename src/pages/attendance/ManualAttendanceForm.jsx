import React, { useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  Paper,
  Typography,
} from "@mui/material";

const initialState = {
  date: "",
  startTime: "",
  endTime: "",
};

export default function ManualAttendanceForm({ onSubmit }) {
  const [form, setForm] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.date || !form.startTime || !form.endTime) {
      alert("All fields are required");
      return;
    }

    const payload = {
      date: form.date,
      punch_in: form.startTime,
      punch_out: form.endTime,
    };

    if (onSubmit) onSubmit(payload);
    setForm(initialState); // Reset form after submission
  };

  return (
    <Paper elevation={3} sx={{ padding: 3, marginBottom: 6 }}>
      <Typography variant="h6" gutterBottom sx={{ marginBottom: 3 }}>
        Add Manual Attendance
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid size={{xs: 12, sm: 4}}>
            <TextField
              fullWidth
              label="Date"
              name="date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={form.date}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid size={{xs: 12, sm: 3}}>
            <TextField
              fullWidth
              label="Start Time"
              name="startTime"
              type="time"
              InputLabelProps={{ shrink: true }}
              value={form.startTime}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid size={{xs: 12, sm: 3}}>
            <TextField
              fullWidth
              label="End Time"
              name="endTime"
              type="time"
              InputLabelProps={{ shrink: true }}
              value={form.endTime}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid size={{xs: 12, sm: 2}}>
            <Box mt={2}>
              <Button type="submit" variant="contained" color="primary">
                Send
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}
