import { useState } from "react";
import {
  TextField, Button, Paper, Typography, Box
} from "@mui/material";
import api from "../services/api";

export default function SubmitCourseForm() {
  const [form, setForm] = useState({
    courseId: "",
    comment: "",
    file: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("courseId", form.courseId);
    formData.append("comment", form.comment);
    formData.append("file", form.file);

    await api.post("/performance/submit", formData);
    alert("Submission successful");
  };

  return (
    <Paper sx={{ p: 4, mt: 3 }}>
      <Typography variant="h6">Submit Course Completion</Typography>
      <Box component="form" mt={2} onSubmit={handleSubmit}>
        <TextField
          label="Course ID"
          name="courseId"
          value={form.courseId}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Comment"
          name="comment"
          value={form.comment}
          onChange={handleChange}
          fullWidth
          multiline
          rows={3}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" component="label">
          Upload Proof
          <input type="file" hidden onChange={handleFileChange} />
        </Button>
        <Box mt={2}>
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
