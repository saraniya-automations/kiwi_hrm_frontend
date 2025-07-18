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


export default function EmployeeList() {
  const [employees, setEmployees] = useState();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState(""); // Search query
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalCount, setTotalCount] = useState(0)

  const navigate = useNavigate();

  const fetchEmployees = async (key = search) => {
    setLoading(true);
    setError("");
    try {
      const data = await api.getEmployees(rowsPerPage, page+1, key)
      setEmployees(data?.items);
      setTotalCount(data?.total)
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

  const handleSearch = async (e) => {
    fetchEmployees();
  };

  const handleClear = () => {
    setSearch("");
    fetchEmployees("");
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
        <Typography variant="h6">Employee Management</Typography>
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
              <TableCell>Role</TableCell>
              <TableCell>Department</TableCell>
              <TableCell align="right">View</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees
              ?.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.user_id}</TableCell>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.role}</TableCell>
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
