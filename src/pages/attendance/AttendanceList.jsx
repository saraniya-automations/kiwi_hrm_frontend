import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Chip,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Tooltip,
} from "@mui/material";
import { Done, Clear } from "@mui/icons-material";
import AttendanceFilter from "./AttendanceFilter"; // Assuming you have a filter component
import ManualAttendanceForm from "./ManualAttendanceForm"; // Assuming you have a manual attendance form component
import Notification from "../../components/Notification"; // Assuming you have a notification component
import api from "../../services/api"; // Adjust the import path as necessary
import RejectAttendanceModal from "./RejectAttendanceModal"; // Assuming you have a reject modal component
import { STATUS_MAP } from "../../utils/constants"; // Assuming you have a constants file for status mapping

// Sample initial data (replace with API call)
const initialData = [
  {
    id: 1,
    employee: "Alice Smith",
    date: "2025-06-25",
    checkIn: "09:01",
    checkOut: "17:02",
    status: "pending",
  },
  {
    id: 2,
    employee: "Bob Johnson",
    date: "2025-06-25",
    checkIn: "09:05",
    checkOut: "16:55",
    status: "approved",
  },
];

export default function AttendancePage() {
  const [pendingData, setPendingData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [notif, setNotif] = useState({
    open: false,
    severity: "error",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const fetchDataByFilter = async (name, startDate, endDate) => {   
    setLoading(true);
    try {
      const response = await api.getAttendanceByFilter(name, startDate, endDate); // Adjust API call as necessary
      setFilteredData(response || []);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      setNotif({
        open: true,
        severity: "error",
        message: "Failed to fetch attendance data",
      });
    } finally {
      setLoading(false);
    }
  };
  const fetchPendingData = async () => {   
    setLoading(true);
    try {
      const response = await api.getPendingAttendance(); // Adjust API call as necessary
      setPendingData(response || []);
    } catch (error) {
      console.error("Error fetching pending attendance data:", error);
      setNotif({
        open: true,
        severity: "error",
        message: "Failed to fetch pending attendance data",
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPendingData();
  }, []);

  const handleSearch = (filters) => {
    const { name, startDate, endDate } = filters;
    // Fetch data based on filters
    try {
      if (!name && !startDate && !endDate) {
        // If no filters, reset to initial data
        setFilteredData([]); // Reset filtered data
      } else {
        // Fetch data based on provided filters   
        fetchDataByFilter(name, startDate, endDate);
      }
    } catch (error) {
      console.error("Error applying filters:", error);
      setNotif({
        open: true,
        severity: "error",
        message: "Failed to apply filters",
      });
    }   
  };

  const handleAction = async({id, status, reason}) => {
    try {
      if (status === "approved") {
        await api.updateAttendanceStatusApprove(id);
        setNotif({
          open: true,
          severity: "success",
          message: "Attendance approved successfully",
        });
      } else if (status === "rejected") {
        await api.updateAttendanceStatusReject(id, reason);          
        setNotif({
          open: true,
          severity: "success",
          message: "Attendance rejected successfully",    
        });
      }
      // Refresh pending data after action
      fetchPendingData();
    } catch (error) {       
      console.error("Error updating attendance status:", error);
      setNotif({
        open: true,
        severity: "error",
        message: error?.message || "Failed to update attendance status",
      });
    }
  };

  const handleRejectClick = (record) => {
    setSelectedRecord(record);
    setRejectModalOpen(true);
  };

  const handleManualAttendance = async (data) => {
    try {
      const res = await api.addManualAttendance(data);
      setNotif({
        open: true,
        severity: "success",
        message: res?.message || "Manual attendance added successfully",
      });
      fetchPendingData();
    } catch (error) {
      console.error("Error adding manual attendance:", error);
      setNotif({
        open: true,
        severity: "error",
        message: error?.message || "Failed to add manual attendance",
      });
    }
  };

  // const filteredData = data.filter((row) =>
  //   row.employee.toLowerCase().includes(search.toLowerCase())
  // );

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h6" gutterBottom>
        Attendance Management
      </Typography>

      <Box mb={3} mt={3}>
        <ManualAttendanceForm
          onSubmit={(data) => handleManualAttendance(data)}
        />
      </Box>

      <Paper elevation={3} sx={{ padding: 3, marginBottom: 6 }}>
        <Typography variant="h6" gutterBottom sx={{ marginBottom: 3 }}>
          View Employee Attendance
        </Typography>

        <AttendanceFilter onSearch={handleSearch} />

        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Check In</TableCell>
                <TableCell>Check Out</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.punch_in}</TableCell>
                  <TableCell>{row.punch_out}</TableCell>
                  <TableCell>
                    <Chip
                      label={STATUS_MAP[row.approval_status?.toLowerCase()]?.label}
                      color={STATUS_MAP[row.approval_status?.toLowerCase()]?.color}
                      size="small"
                    />
                  </TableCell>
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

      <Paper elevation={3} sx={{ padding: 3, marginBottom: 6 }}>
        <Typography mb={3} variant="h6" gutterBottom>
          Pending Attendance
        </Typography>

        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Check In</TableCell>
                <TableCell>Check Out</TableCell>
                <TableCell>Submited Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {pendingData?.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.employee_id}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.punch_in}</TableCell>
                  <TableCell>{row.punch_out}</TableCell>
                  <TableCell>{row.created_at}</TableCell>
                  <TableCell>
                    <Chip
                      label={STATUS_MAP[row?.approval_status?.toLowerCase()].label}
                      color={STATUS_MAP[row?.approval_status?.toLowerCase()].color}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Approve">
                      <IconButton
                        color="success"
                        onClick={() => handleAction({id:row.id, status: "approved"})}
                      >
                        <Done />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Reject">
                      <IconButton
                        color="error"
                        onClick={() => handleRejectClick(row)}
                      >
                        <Clear />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}

              {pendingData.length === 0 && (
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
      <RejectAttendanceModal
        open={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        onSubmit={handleAction}
        record={selectedRecord}
      />
      <Notification
        open={notif.open}
        onClose={() => setNotif({ ...notif, open: false })}
        severity={notif.severity}
        message={notif.message}
      />
    </Box>
  );
}
