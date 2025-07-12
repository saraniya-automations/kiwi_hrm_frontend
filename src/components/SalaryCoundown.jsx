import React, { useEffect, useState } from "react";
import { Box, Typography, Paper } from "@mui/material";

const SalaryCountdown = () => {
  const [timeLeft, setTimeLeft] = useState({});

  const getNextSalaryDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    // Assume salary is paid on the 1st of the next month
    const salaryDate = new Date(year, month + 1, 1, 0, 0, 0);
    return salaryDate;
  };

  const calculateTimeLeft = () => {
    const now = new Date();
    const difference = getNextSalaryDate() - now;

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    const time = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };

    return time;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Paper elevation={3} sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
      <Typography variant="h6" gutterBottom>
        ⏳ Salary Countdown
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Time left until next salary:
      </Typography>
      <Box mt={2} display="flex" justifyContent="center" gap={2}>
        {["days", "hours", "minutes", "seconds"].map((unit) => (
          <Box key={unit}>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              {timeLeft[unit] || 0}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {unit}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default SalaryCountdown;
