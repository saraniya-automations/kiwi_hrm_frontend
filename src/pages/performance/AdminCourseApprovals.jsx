import React, { useState, useEffect } from "react";
import { Table, TableRow, TableCell, TableHead, TableBody, Button, Paper } from "@mui/material";
import api from "../services/api";
import CourseApprovalModal from "./CourseApprovalModal";

export default function AdminCourseApprovals() {
  const [submissions, setSubmissions] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get("/performance/pending-submissions").then((res) => setSubmissions(res.data));
  }, []);

  const handleApprove = (id) => {
    api.post(`/performance/approve/${id}`).then(() => {
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
    });
  };

  const handleReject = (id, reason) => {
    api.post(`/performance/reject/${id}`, { reason }).then(() => {
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
    });
  };

  return (
    <>
      <Paper sx={{ p: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Comment</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {submissions.map((s) => (
              <TableRow key={s.id}>
                <TableCell>{s.employeeName}</TableCell>
                <TableCell>{s.courseTitle}</TableCell>
                <TableCell>{s.comment}</TableCell>
                <TableCell>
                  <Button variant="contained" color="success" onClick={() => handleApprove(s.id)}>
                    Approve
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => setSelected(s)}
                    sx={{ ml: 1 }}
                  >
                    Reject
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <CourseApprovalModal
        open={!!selected}
        onClose={() => setSelected(null)}
        onSubmit={(reason) => handleReject(selected.id, reason)}
      />
    </>
  );
}
