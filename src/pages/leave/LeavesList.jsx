import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  Typography,
  IconButton,
  Tooltip,
  TableContainer,
  Chip,
  TextField,
  Stack,
  Modal,
  TablePagination,
} from "@mui/material";
import LeaveApprovalModal from "./LeaveApprovalModal";
import ApplyLeave from "./ApplyLeave";
import { Done, Clear } from "@mui/icons-material";
import LeaveFilter from "./LeaveFilter"; // Assuming you have a filter component
import api from "../../services/api"; // Adjust the import path as necessary
import Notification from "../../components/Notification";
import { STATUS_MAP } from "../../utils/constants"; // Assuming you have a constants file for status mapping
import LeaveBalanceCard from "./LeaveBalanceCard";

export default function LeavesList() {
  const [leaves, setLeaves] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(leaves);
  const [notif, setNotif] = useState({
    open: false,
    severity: "error",
    message: "",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [leaveBalData, setLeaveBalData] = useState({});

  const fetchPendingLeaves = async () => {
    try {
      const res = await api.getPendingLeave(page+1, rowsPerPage);
      const leaveBal = await api.getLeaveBalance();
      setLeaveBalData(leaveBal);
      setLeaves(res?.items);
      setTotalCount(res?.total);
    } catch (err) {
      setNotif({
        open: true,
        severity: "error",
        message: err.message || "Failed to fetch",
      });
    }
  };

  useEffect(() => {
    fetchPendingLeaves();
  }, [page, rowsPerPage]);

  const handleApprove = async (id) => {
    try {
      const res = await api.updateLeaveStatus(id, "Approved");
      fetchPendingLeaves();
      setNotif({open:true, severity: "success", message: res.message || "Leave approved successfully."})
    } catch (err) {
      setNotif({
        open: true,
        message: err.message || "Failed to delete user",
        severity: "error",
      });
    }
  };

  const handleReject = async (id) => {
    if (window.confirm(`Are you sure you want to reject this leave - ${id}?`)) {
      try {
        const res = await api.updateLeaveStatus(id, "Rejected");
        setNotif({
          open: true,
          message: res.msg || "Successfully deleted user",
          severity: "success",
        });
      } catch (err) {
        setNotif({
          open: true,
          message: err.message || "Failed to delete user",
          severity: "error",
        });
      }
      fetchUsers();
    }
  };

  const handleSearch = async (query) => {
    const { name, startDate, endDate } = query;
    try {
      if (!name && !startDate && !endDate) {
        // If no filters, reset to initial data
        // setNotif({open:true, severity: "error", message: "Enter all values",})
        setFilteredData([]); // Reset filtered data
      } else {
        // Fetch data based on provided filters
        const res = await api.getLeaveByFilter(name, startDate, endDate);
        setFilteredData(res?.items);
      }
    } catch (err) {}
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" mb={4}>
        Leaves Management
      </Typography>
      
      <LeaveBalanceCard balances={leaveBalData} />

      <ApplyLeave onSubmit={() => fetchPendingLeaves()} />

      <Paper elevation={3} sx={{ padding: 3, marginBottom: 6 }}>
        <Typography variant="h6" gutterBottom sx={{ marginBottom: 3 }}>
          View Employee Leaves
        </Typography>

        <LeaveFilter onSearch={handleSearch} />

        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell>Leave Type</TableCell>
                <TableCell>Start date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Leave Reson</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredData?.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.leave_type}</TableCell>
                  <TableCell>{row.start_date}</TableCell>
                  <TableCell>{row.end_date}</TableCell>
                  <TableCell>{row.reason}</TableCell>
                  {/* <TableCell>
                    <Chip
                      label={
                        STATUS_MAP[row.approval_status?.toLowerCase()]?.label
                      }
                      color={
                        STATUS_MAP[row.approval_status?.toLowerCase()]?.color
                      }
                      size="small"
                    />
                  </TableCell> */}
                </TableRow>
              ))}

              {filteredData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No attendance records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Paper sx={{ p: 4 }}>
        <Typography variant="h6">Pending Leaves</Typography>
        <Box mt={2}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Leave Id</TableCell>
                <TableCell>Employee Id</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Dates</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaves?.map((leave) => (
                <TableRow key={leave.id}>
                  <TableCell>{leave.id}</TableCell>
                  <TableCell>{leave.employee_id}</TableCell>
                  <TableCell>{leave.name}</TableCell>
                  <TableCell>{leave.leave_type}</TableCell>
                  <TableCell>
                    {leave.start_date} to {leave.end_date}
                  </TableCell>
                  <TableCell>{leave.reason}</TableCell>
                  <TableCell>{leave.status}</TableCell>
                  <TableCell align="center">
                    {leave.status === "Pending" && (
                      <>
                        <Tooltip title="Approve">
                          <IconButton
                            color="success"
                            onClick={() => handleApprove(leave.id)}
                          >
                            <Done />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Reject">
                          <IconButton
                            color="error"
                            onClick={() => handleReject(leave.id)}
                          >
                            <Clear />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        <LeaveApprovalModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          leave={selectedLeave}
          onReject={(reason) => {
            handleReject(selectedLeave.id, reason);
            setModalOpen(false);
          }}
        />
      </Paper>

      <Notification
        open={notif.open}
        onClose={() => setNotif({ ...notif, open: false })}
        severity={notif.severity}
        message={notif.message}
      />
    </Box>
  );
}
