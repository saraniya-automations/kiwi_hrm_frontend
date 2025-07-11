import React, { useState, useEffect } from "react";
import {
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  Button,
  Paper,
  Tooltip,
  IconButton,
  Typography,
  Stack,
  Box,
} from "@mui/material";
import api from "../../services/api";
import CourseApprovalModal from "./CourseApprovalModal";
import { Done, Clear } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Notification from "../../components/Notification";

export default function AdminCourseApprovals() {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [allSubmissions, setAllSubmissions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [notif, setNotif] = useState({ open: false, severity: "error", message: "" });

  const fetchData = async () => {
    const res = await api.getPerfSubPending();
    const resAll = await api.getPerfSubAll()
    setSubmissions(res?.items);
    setAllSubmissions(resAll?.items)
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAction = async (data, newdata) => {
    console.log(data);
    console.log(newdata);
    try {
      const payload = {
        status: data.status,
        ...newdata,
      };
  
      const res = await api.updatePrefStatus(data.id, payload);
      setNotif({open: true,  severity: "success", message:  res?.message || "Updated successfully!"})
      fetchData()

    } catch (err) {
      setNotif({open: true,  severity: "error", message:  err?.message || "Failed changes!"})
    }

    
  };

  return (
    <>
      <Paper sx={{ p: 4 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Typography variant="h6">Performance Management</Typography>
          <Button
            variant="outlined"
            onClick={() => {
              navigate("/admin/performance/my");
            }}
            justifyContent="sp"
          >
            My Performance
          </Button>
        </Stack>
      </Paper>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h6">Pending Review</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Course Name</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Completion Note</TableCell>
              <TableCell>Completed At</TableCell>
              <TableCell>File</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {submissions?.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.course_name}</TableCell>
                <TableCell>{item.department}</TableCell>
                <TableCell>{item.completion_note}</TableCell>
                <TableCell>{item.completed_at}</TableCell>
                <TableCell>{item.file_path}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Approve">
                    <IconButton
                      color="success"
                      onClick={() =>
                        setSelected({ ...item, status: "Approved" })
                      }
                    >
                      <Done />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Reject">
                    <IconButton
                      color="error"
                      onClick={() =>
                        setSelected({ ...item, status: "Rejected" })
                      }
                    >
                      <Clear />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Paper sx={{ p: 4 }}>
        <Typography variant="h6">All Courses</Typography>
        <Box overflow={"auto"} mb={2}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Course Name</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Completion Note</TableCell>
                <TableCell>Completed At</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Reviewed By</TableCell>
                <TableCell>Reviewed At</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Admin Comment</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allSubmissions?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.course_name}</TableCell>
                  <TableCell>{item.department}</TableCell>
                  <TableCell>{item.completion_note}</TableCell>
                  <TableCell>{item.completed_at}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>{item.reviewed_by}</TableCell>
                  <TableCell>{item.reviewed_at}</TableCell>
                  <TableCell>{item.rating}</TableCell>
                  <TableCell>{item.admin_comment}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Paper>

      <CourseApprovalModal
        open={!!selected}
        onClose={() => setSelected(null)}
        onSubmit={(data) => handleAction(selected, data)}
        status={selected?.status}
      />
      <Notification
        open={notif.open}
        onClose={() => setNotif({ ...notif, open: false })}
        severity={notif.severity}
        message={notif.message}
      />
    </>
  );
}
