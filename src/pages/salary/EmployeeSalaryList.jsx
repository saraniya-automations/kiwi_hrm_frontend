import React, { useState, useEffect } from "react";
import {
  Paper,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  Typography,
  Button,
  Box,
  Stack,
  IconButton,
  TablePagination,
  TableContainer,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import api from "../../services/api"; // Adjust the import path as necessary
import { useNavigate } from "react-router-dom";
import AddSalary from "./AddSalary"; // Assuming you have an AddSalary component
import SalaryFilter from "./SalaryFilter";

export default function EmployeeSalaryList() {
  const navigate = useNavigate();
  const [salaries, setSalaries] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Default rows per page
  const [totalCount, setTotalCount] = useState(0);
  const [filteredData, setFilteredData] = useState([]);

  async function fetchSalary(page = 0, rowsPerPage = 10) {
    //   const res = await api.get("/salary/my");
    const res = await api.getAllSalary(page+1, rowsPerPage);
    setSalaries(res?.items || []);
    setTotalCount(res.total || 0);
  }
  useEffect(() => {
    fetchSalary();
  }, []);

  const handleDownload = async (id, month) => {
    const res = await api.exportSalary(id, month);
    const blob = await res.blob();
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `salary_report_${id}_${month}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    fetchSalary(newPage, rowsPerPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when rows per page changes
    fetchSalary(0, parseInt(event.target.value, 10));
  };
  const handleSearch = async (query) => {
    const { id, year, month } = query;
    try {
      if (!id && !year && !month) {
        // If no filters, reset to initial data
        setFilteredData([]); // Reset filtered data
      } else {
        // Fetch data based on provided filters
        try {
          const res = await api.getSalaryByFilter(id, `${year}-${month}`);
          if (Array.isArray(res?.items)) {
            setFilteredData(res?.items);
          } else {
            alert(res.message);
          }
        } catch (err) {
          console.error(err);
        }
      }
    } catch (err) {}
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h6" mb={4}>
        Salary Management
      </Typography>

      <AddSalary onSubmit={fetchSalary} />

      <Paper elevation={3} sx={{ padding: 3, marginTop: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ marginBottom: 3 }}>
          View Employee Salary
        </Typography>

        <SalaryFilter onSearch={handleSearch} />

        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell>Month</TableCell>
                <TableCell>Pay Frequency</TableCell>
                <TableCell>Net Salary</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredData?.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.employee_id}</TableCell>
                  <TableCell>{row.salary_month}</TableCell>
                  <TableCell>{row.pay_frequency}</TableCell>
                  <TableCell>{row.net_salary}</TableCell>
                  <TableCell>{row.reason}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      onClick={() =>
                        handleDownload(row.employee_id, row.salary_month)
                      }
                    >
                      Download
                    </Button>
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

      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h6">Employee Salary</Typography>
        <Box overflow={"auto"} mb={2}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell>Month</TableCell>
                <TableCell>Frequncy</TableCell>
                <TableCell>Gener</TableCell>
                <TableCell>Generated Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {salaries.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{s.employee_id}</TableCell>
                  <TableCell>{s.salary_month}</TableCell>
                  <TableCell>{s.pay_frequency}</TableCell>
                  <TableCell>{s.generated_at}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      onClick={() =>
                        handleDownload(s.employee_id, s.salary_month)
                      }
                    >
                      Download
                    </Button>
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
      </Paper>
    </Box>
  );
}
