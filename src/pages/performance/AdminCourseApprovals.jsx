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
  TablePagination,
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
  const [notif, setNotif] = useState({
    open: false,
    severity: "error",
    message: "",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [page1, setPage1] = useState(0);
  const [rowsPerPage1, setRowsPerPage1] = useState(10);
  const [totalCount1, setTotalCount1] = useState(0);

  const getPerfSubPending = async (page=1, pagelimt=10) => {
    const res = await api.getPerfSubPending(page+1, pagelimt);
    setSubmissions(res?.items);
    setTotalCount(res?.total)
  };

  const getPerfSubAll = async (page=1, pagelimt=10) => {
    const resAll = await api.getPerfSubAll(page+1, pagelimt);
    setAllSubmissions(resAll?.items);
    setTotalCount1(resAll?.total)
  };

  useEffect(() => {
    getPerfSubAll();
    getPerfSubPending();
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
      setNotif({
        open: true,
        severity: "success",
        message: res?.message || "Updated successfully!",
      });
      fetchData();
    } catch (err) {
      setNotif({
        open: true,
        severity: "error",
        message: err?.message || "Failed changes!",
      });
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    getPerfSubPending(newPage, rowsPerPage)
  }
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    getPerfSubPending(0, parseInt(event.target.value, 10))
  };

  const handleChangePage1 = (event, newPage) => {
    setPage1(newPage);
    getPerfSubAll(newPage, rowsPerPage)
  }
  const handleChangeRowsPerPage1 = (event) => {
    setRowsPerPage1(parseInt(event.target.value, 10));
    setPage1(0);
    getPerfSubAll(0, parseInt(event.target.value, 10))
  };

  return (
    <>
      <Paper sx={{ p: 4, mb: 4 }}>
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

      <Paper sx={{ p: 4, mb: 4 }}>
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
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
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
          <TablePagination
            component="div"
            count={totalCount1}
            page={page1}
            onPageChange={handleChangePage1}
            rowsPerPage={rowsPerPage1}
            onRowsPerPageChange={handleChangeRowsPerPage1}
          />
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
