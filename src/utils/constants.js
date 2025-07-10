export const ROLES = ["Admin", "Employee"];
export const DEPARTMENTS = ["Engineering", "Management", "HR", "Finance", "Marketing", "Sales", "Operations", "Support"];
export const STATUS = ["Active", "Inactive"];
export const MONTHS = [
  { label: "January", value: "01" },
  { label: "February", value: "02" },
  { label: "March", value: "03" },
  { label: "April", value: "04" },
  { label: "May", value: "05" },
  { label: "June", value: "06" },
  { label: "July", value: "07" },
  { label: "August", value: "08" },
  { label: "September", value: "09" },
  { label: "October", value: "10" },
  { label: "November", value: "11" },
  { label: "December", value: "12" },
];

export const STATUS_MAP = {
  approved: { label: "Approved", color: "success" },
  rejected: { label: "Rejected", color: "error" },
  pending: { label: "Pending", color: "default" },
};

export const SALARY_CURRENCIES = [
  { label: "NZD", value: "NZD" },
  { label: "USD", value: "USD" },
  { label: "AUD", value: "AUD" }
];

export const SALARY_FREQUENCIES = [
  { label: "Monthly", value: "Monthly" },
  { label: "Bi-Weekly", value: "Bi-Weekly" },
  { label: "Weekly", value: "Weekly" },
]

export const SALARY_STATUS = {
  paid: { label: "Paid", color: "success" },
  unpaid: { label: "Unpaid", color: "error" },
  pending: { label: "Pending", color: "default" },
};
 
export const LEAVE_TYPES = [
    {label: "Sick Leave", value: "sick"},
    {label: "Casual Leave", value: "casual"},
    {label: "Annual Leave", value: "annual"},
    {label: "Maternity Leave", value: "maternity"},
];

export const NOTIFICATION_TYPES = {
  info: { label: "Info", color: "info" },
  success: { label: "Success", color: "success" },
  warning: { label: "Warning", color: "warning" },
  error: { label: "Error", color: "error" },
};
export const NOTIFICATION_MESSAGES = {
  leaveApproved: "Leave request approved successfully.",
  leaveRejected: "Leave request rejected.",
  salaryAdded: "Salary details added successfully.",
  salaryUpdated: "Salary details updated successfully.",
  attendanceMarked: "Attendance marked successfully.",
  errorOccurred: "An error occurred. Please try again later.",
};
