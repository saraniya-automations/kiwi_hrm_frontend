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
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import api from "../../services/api";
import Notification from "../../components/Notification"; // Adjust the import path as necessary


export default function UserList() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notif, setNotif] = useState({ open: false, severity: "error", message: "" });
  const [totalCount, setTotalCount] = useState()

  const fetchUsers = async (query = "") => {
    setLoading(true);
    setError("");
    try {
      let data;
      if (query.trim() === "") {
        data = await api.getAllUsers(rowsPerPage, page+1);
      } else {
        data = await api.getAllUsersByKey(query);
      }
      console.log(data, "data")
      setUsers(data?.items || []);
      setTotalCount(data?.total || 0)
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage]);

  const handleEdit = (id) => {
    navigate(`/admin/user/edit/${id}`);
  };

  const handleDelete = async(id) => {
    if (window.confirm(`Are you sure you want to delete this employee - ${id}?`)) {
      try {
        const res = await api.deleteUser(id);
        setNotif({ open: true, message: res.msg || "Successfully deleted user", severity: "success" });
      } catch (err) {
        setNotif({ open: true, message: err.message || "Failed to delete user", severity: "error" });
      }
      await api.deleteUser(id);
      fetchUsers();
    }
  };

  const handleAdd = () => {
    navigate("/admin/user/add");
    // const nextId = employees.length ? employees[employees.length - 1].id + 1 : 1;
    // const newEmployee = {
    //   id: nextId,
    //   name: `Employee ${nextId}`,
    //   position: "New Position",
    //   department: "New Department",
    // };
    // setEmployees((prev) => [...prev, newEmployee]);
  };

  const handleSearch = async (e) => {
    fetchUsers(search);
  };
  const handleClear = () => {
    setSearch("");
    fetchUsers("");
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper sx={{ padding: 3 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        mb={6}
      >
        <Typography variant="h6">User Management</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
          Add User
        </Button>
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

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <>
          <Box overflow="auto">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User ID</TableCell>
                  <TableCell>User Name</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users
                  ?.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.employee_id}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell>{user.status}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={() => handleEdit(user.employee_id)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(user.employee_id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                {users.length === 0 && (
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
            count={totalCount}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
       <Notification
              open={notif.open}
              onClose={() => setNotif({ ...notif, open: false })}
              severity={notif.severity}
              message={notif.message}
            />
    </Paper>
  );
}
