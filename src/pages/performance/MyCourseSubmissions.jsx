import { useEffect, useState } from "react";
import { Table, TableRow, TableCell, TableHead, TableBody, Paper, Typography } from "@mui/material";
import api from "../services/api";

export default function MyCourseSubmissions() {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    api.get("/performance/my-submissions").then((res) => setSubmissions(res.data));
  }, []);

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h6">My Submissions</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Course</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Comment</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {submissions.map((s) => (
            <TableRow key={s.id}>
              <TableCell>{s.courseTitle}</TableCell>
              <TableCell>{s.status}</TableCell>
              <TableCell>{s.adminComment || "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
