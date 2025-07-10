import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import { useState } from "react";

export default function CourseApprovalModal({ open, onClose, onSubmit }) {
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    if (!reason.trim()) return alert("Please enter a reason");
    onSubmit(reason);
    setReason("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Reject Course Submission</DialogTitle>
      <DialogContent>
        <TextField
          label="Reason"
          fullWidth
          multiline
          rows={4}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="error" variant="contained" onClick={handleSubmit}>
          Reject
        </Button>
      </DialogActions>
    </Dialog>
  );
}
