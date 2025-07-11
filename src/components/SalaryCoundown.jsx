import { Box, Typography, Paper } from "@mui/material";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";

export default function SalaryCountdown() {
  const getNextSalaryDate = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const salaryDay = 25;

    let salaryDate = new Date(currentYear, currentMonth, salaryDay);

    if (today > salaryDate) {
      // if salary day has passed, set next month
      salaryDate = new Date(currentYear, currentMonth + 1, salaryDay);
    }

    const diffTime = salaryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return { salaryDate, diffDays };
  };

  const { salaryDate, diffDays } = getNextSalaryDate();

  return (
    <Paper sx={{ p: 3, borderRadius: 3, textAlign: "center" }} elevation={3}>
      <Box display="flex" justifyContent="center" alignItems="center" gap={1} mb={1}>
        <AccessAlarmIcon color="primary" />
        <Typography variant="h6">Salary Countdown</Typography>
      </Box>
      <Typography variant="h4" fontWeight={600} color="primary">
        {diffDays} {diffDays === 1 ? "day" : "days"}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        until your next salary on {salaryDate.toLocaleDateString()}
      </Typography>
    </Paper>
  );
}
