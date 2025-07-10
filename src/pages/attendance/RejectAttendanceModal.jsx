import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

export default function RejectAttendanceModal({ open, onClose, onSubmit, record }) {
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    if (!reason.trim()) {
      alert("Please provide a reason.");
      return;
    }

    onSubmit({ id: record.id, reason, status: "rejected" });
    setReason("");
    onClose();
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Reject Attendance - {record?.employee_id}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Reason for Rejection"
          fullWidth
          multiline
          rows={4}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="error">Reject</Button>
      </DialogActions>
    </Dialog>
  );
}
