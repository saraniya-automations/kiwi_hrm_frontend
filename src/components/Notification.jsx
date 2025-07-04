import { Alert, Snackbar } from "@mui/material";
import React from "react";

export default function Notification({ open, onClose, severity = "error", message }) { // severity defaults to "error" / "success" /  "info" / "warning"
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
