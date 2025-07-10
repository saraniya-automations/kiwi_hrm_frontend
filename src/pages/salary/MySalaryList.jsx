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

export default function MySalaryList() {
  const navigate = useNavigate();
  const [filteredData, setFilteredData] = useState([]);

  const handleDownload = async (id, month) => {
    const res = await api.downloadMySalary(month);
    const blob = await res.blob();
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `salary_report_${id}_${month}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleSearch = async (query) => {
    const { year, month } = query;
    try {
      if (!year && !month) {
        // If no filters, reset to initial data
        setFilteredData([]); // Reset filtered data
      } else {
        // Fetch data based on provided filters
        try {
          const res = await api.getMySalaryByFilter(`${year}-${month}`);
          if (Array.isArray(res)) {
            setFilteredData(res);
          } else if(res instanceof Object && res.constructor === Object) {
            console.log([res])
            setFilteredData([res]);
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
        My Salary
      </Typography>

      <Paper elevation={3} sx={{ padding: 3, marginTop: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ marginBottom: 3 }}>
          View Salary
        </Typography>

        <SalaryFilter onSearch={handleSearch} itIsMy={true} />

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
    </Box>
  );
}
