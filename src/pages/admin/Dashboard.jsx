import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Container,
  Box,
} from "@mui/material";
import axios from "../../utils/axiosInstance";
import { useSelector } from "react-redux";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [overview, setOverview] = useState({});
  const [roleStats, setRoleStats] = useState({});
  const [attendance, setAttendance] = useState([]);
  const [assignmentStats, setAssignmentStats] = useState({});
  const [monthlyResults, setMonthlyResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [overviewRes, roleRes, attRes, assignRes, monthlyResultRes] =
        await Promise.all([
          axios.get("/admin/overview-stats"),
          axios.get("/admin/user-role-stats"),
          axios.get("/admin/attendance-summary"),
          axios.get("/admin/assignment-stats"),
          axios.get("/admin/stats/monthly-results"),
        ]);

      const transformedRoleStats = {};
      roleRes.data.data.forEach((item) => {
        transformedRoleStats[item.role] = item.count || item._count?.role;
      });

      setOverview(overviewRes.data.data);
      setRoleStats(transformedRoleStats);
      setAttendance(attRes.data.data);
      setAssignmentStats(assignRes.data.data);
      setMonthlyResults(monthlyResultRes.data.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchStats();
    }
  }, [user?.id]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Box display="flex" flexDirection="column" gap={3}>
          {/* User Role Pie Chart */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              User Role Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Student", value: roleStats.STUDENT || 0 },
                    { name: "Teacher", value: roleStats.TEACHER || 0 },
                    { name: "Admin", value: roleStats.ADMIN || 0 },
                  ]}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {COLORS.map((color, index) => (
                    <Cell key={index} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>

          {/* Overview Stats */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Overview Stats
            </Typography>
            <Typography>Students: {overview.students}</Typography>
            <Typography>Teachers: {overview.teachers}</Typography>
            <Typography>Subjects: {overview.subjects}</Typography>
            <Typography>Classes: {overview.classes}</Typography>
          </Paper>

          {/* Attendance Summary */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Attendance Summary
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={attendance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#1976d2" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>

          {/* Assignment Stats */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Assignments
            </Typography>
            <Typography>Total Assignments: {assignmentStats.total}</Typography>
            <Typography>
              Pending Submissions: {assignmentStats.pending}
            </Typography>
          </Paper>

          {/* Monthly Results */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Monthly Result Trends
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyResults}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="passed"
                  stackId="a"
                  fill="#4caf50"
                  name="Passed"
                />
                <Bar
                  dataKey="failed"
                  stackId="a"
                  fill="#f44336"
                  name="Failed"
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Box>
      )}
    </Container>
  );
};

export default Dashboard;
