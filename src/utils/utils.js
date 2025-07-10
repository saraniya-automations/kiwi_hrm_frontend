export const validateUserInput = (formValues, isUpdate = false) => {
  const newErrors = {};
  if (!formValues.name.trim()) newErrors.name = "UserName is required";
  if (!formValues.email.trim()) newErrors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email))
    newErrors.email = "Invalid email format";
  if (!formValues.phone) newErrors.phone = "Phone is required";
  else if (!/^\d{10}$/.test(formValues.phone))
    newErrors.phone = "Must be 10 digits";
  if (!formValues.role) newErrors.role = "Role is required";
  if (!formValues.department) newErrors.department = "Department is required";
  if (!isUpdate & (!formValues.password || formValues.password.length < 6))
    newErrors.password = "Password must be at least 6 characters";
  return [Object.keys(newErrors).length === 0, newErrors];
};
