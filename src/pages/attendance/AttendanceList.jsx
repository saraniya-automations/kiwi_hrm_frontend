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
import { Done, Clear, Edit, HourglassBottom } from "@mui/icons-material";

// Sample status styles
const statusMap = {
  approved: { label: "Approved", color: "success" },
  rejected: { label: "Rejected", color: "error" },
  pending: { label: "Pending", color: "default" },
};

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
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");

  const handleAction = (id, newStatus) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
  };

  const filteredData = data.filter((row) =>
    row.employee.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h6" gutterBottom>
        Attendance Management
      </Typography>

      <Box mb={2}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Search by Employee"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Grid>
        </Grid>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Employee</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Check In</TableCell>
              <TableCell>Check Out</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.employee}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.checkIn}</TableCell>
                <TableCell>{row.checkOut}</TableCell>
                <TableCell>
                  <Chip
                    label={statusMap[row.status].label}
                    color={statusMap[row.status].color}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Approve">
                    <IconButton
                      color="success"
                      onClick={() => handleAction(row.id, "approved")}
                    >
                      <Done />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Reject">
                    <IconButton
                      color="error"
                      onClick={() => handleAction(row.id, "rejected")}
                    >
                      <Clear />
                    </IconButton>
                  </Tooltip>
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
  );
}
