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
} from "@mui/material";
import LeaveApprovalModal from "./LeaveApprovalModal";
import ApplyLeave from "./ApplyLeave";
import { Done, Clear } from "@mui/icons-material";
import LeaveFilter from "./LeaveFilter"; // Assuming you have a filter component
import api from "../../services/api"; // Adjust the import path as necessary
import Notification from "../../components/Notification";
import { STATUS_MAP } from "../../utils/constants"; // Assuming you have a constants file for status mapping

const dummyLeaves = [
  {
    id: 1,
    employee: "Alice",
    type: "Sick Leave",
    startDate: "2025-06-24",
    endDate: "2025-06-26",
    reason: "Fever",
    status: "Pending",
  },
  // Add more entries here
];

export default function MyLeavesList() {
  const [leaves, setLeaves] = useState(dummyLeaves);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(leaves);
  const [notif, setNotif] = useState({
    open: false,
    severity: "error",
    message: "",
  });

  const fetchLeaves = async () => {
    try {
    const res = await api.getMyLeave()
    setLeaves(res?.items)
    } catch (err) {
      setNotif({
        open: true,
        severity: "error",
        message: err.message || 'Failed to fetch',
      });
    }
  }

  useEffect(()=>{
    fetchLeaves();
  }, [])

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" mb={4}>
        Leaves Management
      </Typography>

      <ApplyLeave
        onSubmit={() => fetchLeaves()}
      />

      <Paper sx={{ p: 4 }}>
        <Typography variant="h6">My Leaves</Typography>
        <Box mt={2}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Dates</TableCell>
                <TableCell>Reason</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaves?.map((leave, i) => (
                <TableRow key={i}>
                  <TableCell>{leave.name}</TableCell>
                  <TableCell>{leave.leave_type}</TableCell>
                  <TableCell>
                    {leave.start_date} to {leave.end_date}
                  </TableCell>
                  <TableCell>{leave.reason}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>

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
