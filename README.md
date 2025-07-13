# 🌿 KiWi HRM – Human Resource Management System

A modern web-based Human Resource Management (HRM) system built with **React**, **Material UI**, and **Zustand** for frontend, and **Python (Flask/FastAPI)** as the backend. Designed to manage employees, attendance, leaves, salaries, and performance tracking efficiently.

---

## 🚀 Features

### ✅ Authentication
- JWT-based login/logout
- Role-based access (Admin / Employee)
- Route guards & token expiry handling

### 👨‍💼 Employee Management (PIM)
- Add/edit/view employees
- Upload profile picture (Base64)
- Personal details, contact info, job, emergency, dependents, qualification

### 🕒 Attendance
- View attendance history
- Search/filter by date and name
- Approve/reject manual entries with reason
- Add manual in/out records

### 📅 Leave Management
- Apply leave
- View balances (Annual, Sick, Casual, etc.)
- Admin approval/rejection
- Leave history & status tracking

### 💰 Salary Module
- Assign and view salary by employee ID and month
- Export PDF payslips
- Select year/month dropdown

### 📈 Performance
- List department-specific mandatory courses
- Submit completed courses
- Admin approval with comments

### 📊 Dashboard
- Welcome card with avatar
- Leave balances summary
- Recent attendance list
- Salary countdown
- Charts using MUI

---

## 🧱 Tech Stack

| Layer       | Technology                    |
|-------------|-------------------------------|
| Frontend    | React, Vite, MUI, Zustand     |
| Backend     | Python (Flask or FastAPI)     |
| Auth        | JWT, LocalStorage             |
| State Mgmt  | Zustand                       |
| Charts      | MUI Charts                    |
| Styling     | Tailwind utility with MUI `sx`|

---

## 📦 Project Structure
```
KiWi-HRM/
├── src/
│ ├── components/
│ ├── layouts/
│ ├── pages/
│ │ ├── admin/
│ │ ├── attendance/
│ │ ├── leave/
│ │ ├── perfomance/
│ │ └── pim/
│ │ └── salary/
│ │ └── Dashboard.jsx
│ │ └── DashboardAdmin.jsx
│ │ └── Login.jsx
│ │ └── ForgotPassword.jsx
│ │ └── ResetPassword.jsx
│ │ └── NotFound.jsx
│ ├── store/ # Zustand stores
│ ├── services/ # Centralized API calls
│ ├── router/ # AppRouter config
│ ├── utils/ # Token utils, , host
│ └── App.jsx
├── .env # VITE_API_BASE_URL
├── README.md
```

## 🛠️ Setup Instructions

```bash
git clone https://github.com/saraniya-automations/kiwi_hrm_frontend.git

# Install dependencies
npm install

# Add env file
echo "VITE_API_BASE_URL=http://127.0.0.1:5000" > .env

# Start dev server
npm run dev
