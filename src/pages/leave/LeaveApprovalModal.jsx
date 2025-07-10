import React, { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Button
} from "@mui/material";

export default function LeaveApprovalModal({ open, onClose, onReject, leave }) {
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    if (!reason.trim()) return alert("Reason is required.");
    onReject(reason);
    setReason("");
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Reject Leave</DialogTitle>
      <DialogContent>
        <TextField
          label="Reason for Rejection"
          fullWidth
          multiline
          rows={4}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          autoFocus
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} color="error" variant="contained">
          Reject
        </Button>
      </DialogActions>
    </Dialog>
  );
}
