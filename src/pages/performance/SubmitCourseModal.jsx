import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import { useState } from "react";

const initialFormState = {
  completion_note: "",
  file_path: "",
  completed_at: "",
}

export default function SubmitCourseModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState(initialFormState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!form?.completed_at.trim()) return alert("Please enter a Date");
    else if (!form?.file_path.trim()) return alert("Please enter a File path");
    else if (!form?.completion_note.trim()) return alert("Please enter a Note");
    onSubmit(form);
    setForm(initialFormState);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>My Submissions</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} marginTop={3}>

          <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Complete Date"
            name="completed_at"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={form.completed_at}
            onChange={handleChange}
            required
          />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="File Path"
            name="file_path"
            value={form.file_path}
            onChange={handleChange}
            fullWidth
            required
          />
          </Grid>
          <Grid size={{ xs: 12 }}>
          <TextField
            label="Note"
            name="completion_note"
            value={form.completion_note}
            onChange={handleChange}
            fullWidth
            multiline
            required
            rows={3}
          />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
