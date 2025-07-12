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
  TablePagination,
  CircularProgress,
} from "@mui/material";
import { Done, Clear, Edit, HourglassBottom } from "@mui/icons-material";
import AttendanceFilter from "./AttendanceFilter"; // Assuming you have a filter component
import ManualAttendanceForm from "./ManualAttendanceForm"; // Assuming you have a manual attendance form component
import Notification from "../../components/Notification"; // Assuming you have a notification component
import api from "../../services/api"; // Adjust the import path as necessary
import RejectAttendanceModal from "./RejectAttendanceModal"; // Assuming you have a reject modal component
import { STATUS_MAP } from "../../utils/constants"; // Assuming you have a constants file for status mapping

export default function AttendancePage() {
  const [filteredData, setFilteredData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [notif, setNotif] = useState({
    open: false,
    severity: "error",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const fetchDataByFilter = async (startDate, endDate) => {
    setLoading(true);
    try {
      const response = await api.getMyAttendanceByFilter(startDate, endDate); // Adjust API call as necessary
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
  const fetchAllMyAtt = async () => {
    setLoading(true);
    try {
      const response = await api.getAllMyAttendance(page + 1, rowsPerPage); // Adjust API call as necessary
      setAllData(response?.items || []);
      setTotalCount(response?.total || 0);
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

  const handleSearch = (filters) => {
    const { startDate, endDate } = filters;
    // Fetch data based on filters
    try {
      if (!startDate && !endDate) {
        // If no filters, reset to initial data
        setFilteredData([]); // Reset filtered data
      } else {
        // Fetch data based on provided filters
        fetchDataByFilter(startDate, endDate);
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

  const handleManualAttendance = async (data) => {
    try {
      const res = await api.addManualAttendance(data);
      fetchAllMyAtt();
      setNotif({
        open: true,
        severity: "success",
        message: res?.message || "Manual attendance added successfully",
      });
    } catch (error) {
      console.error("Error adding manual attendance:", error);
      setNotif({
        open: true,
        severity: "error",
        message: error?.message || "Failed to add manual attendance",
      });
    }
  };

  useEffect(() => {
    fetchAllMyAtt();
  }, [page, rowsPerPage]);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const data = filteredData?.length > 0 ? filteredData : allData;

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h6" gutterBottom>
        My Attendance
      </Typography>

      <Box mb={3} mt={3}>
        <ManualAttendanceForm
          onSubmit={(data) => handleManualAttendance(data)}
        />
      </Box>

      <Paper elevation={3} sx={{ padding: 3, marginBottom: 6 }}>
        <Typography variant="h6" gutterBottom sx={{ marginBottom: 3 }}>
          View My Attendance
        </Typography>

        <AttendanceFilter onSearch={handleSearch} itIsMy={true} />

        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Check In</TableCell>
                <TableCell>Check Out</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {data?.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.punch_in}</TableCell>
                  <TableCell>{row.punch_out}</TableCell>
                  <TableCell>
                    <Chip
                      label={
                        STATUS_MAP[row.approval_status?.toLowerCase()]?.label
                      }
                      color={
                        STATUS_MAP[row.approval_status?.toLowerCase()]?.color
                      }
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}

              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No attendance records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {filteredData?.length === 0 && (
          <TablePagination
            component="div"
            count={totalCount}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
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
