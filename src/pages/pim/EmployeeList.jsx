import React, { useState, useEffect } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  IconButton,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import api from "../../services/api";

// Dummy employee data
const initialEmployees = Array.from({ length: 25 }).map((_, i) => ({
  id: i + 1,
  name: `Employee ${i + 1}`,
  position: "Software Engineer",
  department: "Development",
}));

export default function EmployeeList() {
  const [employees, setEmployees] = useState();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState(""); // Search query
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchEmployees = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.getEmployees(rowsPerPage, page, search)
      setEmployees(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [page, rowsPerPage]);

  const handleEdit = (id) => {
    navigate(`/admin/pim/edit/${id}/personal`);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      setEmployees((prev) => prev.filter((e) => e.id !== id));
    }
  };

  const handleSearch = async (e) => {
    fetchEmployees();
  };

  const handleClear = () => {
    setSearch("");
    fetchEmployees();
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filtered employees
  // const filteredEmployees = employees.filter((e) =>
  //   e.name.toLowerCase().includes(search.toLowerCase())
  // );

  return (
    <Paper sx={{ padding: 3 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        mb={2}
        width={"100%"}
      >
        <Typography variant="h6">Employee Information</Typography>
      </Stack>

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          label="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
        <Button variant="outlined" onClick={handleClear}>
          Clear
        </Button>
      </Box>

      <Box overflow="auto">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Department</TableCell>
              <TableCell align="right">View</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              ?.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.user_id}</TableCell>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => handleEdit(employee.user_id)}
                      color="primary"
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            {employees?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No employees found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>

      <TablePagination
        component="div"
        count={employees?.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
