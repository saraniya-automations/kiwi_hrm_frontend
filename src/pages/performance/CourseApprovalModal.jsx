import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { useState } from "react";

const initialData = {
  admin_comment: "",
  rating: "",
};

export default function CourseApprovalModal({
  open,
  onClose,
  onSubmit,
  status,
}) {
  const [comments, setComments] = useState(initialData);

  const handleSubmit = () => {
    if (!comments?.admin_comment.trim()) return alert("Please enter a reason");
    onSubmit(comments);
    setComments(initialData);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setComments((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>
        {" "}
        {status === "Rejected" ? "Reject" : "Success"} Course Submission
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 3 }}>
          {status === "Approved" && (
            <TextField
              label="Rating"
              fullWidth
              rows={4}
              value={comments?.rating}
              name="rating"
              onChange={handleChange}
              sx={{ mb: 3 }}
            />
          )}
          <TextField
            label={status === "Rejected" ? "Reason" : "Comment"}
            fullWidth
            multiline
            rows={4}
            value={comments?.admin_comment}
            name="admin_comment"
            onChange={handleChange}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        {status === "Rejected" ? (
          <Button color="error" variant="contained" onClick={handleSubmit}>
            Reject
          </Button>
        ) : (
          <Button color="success" variant="contained" onClick={handleSubmit}>
            Approve
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
