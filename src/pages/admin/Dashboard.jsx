import { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  CircularProgress,
  Alert,
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

const COLORS = ["#1B4F72", "#148F77", "#E0A100", "#C0392B"];

function asCount(value) {
  if (typeof value === "number") return value;
  if (value && typeof value === "object") {
    if (typeof value._all === "number") return value._all;
    const numeric = Object.values(value).find((item) => typeof item === "number");
    return numeric ?? 0;
  }
  return 0;
}

const statItems = [
  { key: "students", label: "Students" },
  { key: "teachers", label: "Teachers" },
  { key: "subjects", label: "Subjects" },
  { key: "classes", label: "Classes" },
];

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [overview, setOverview] = useState({});
  const [roleStats, setRoleStats] = useState({});
  const [attendance, setAttendance] = useState([]);
  const [assignmentStats, setAssignmentStats] = useState({});
  const [monthlyResults, setMonthlyResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.id) return undefined;

    let cancelled = false;

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

        if (cancelled) return;

        const transformedRoleStats = {};
        (roleRes.data?.data || []).forEach((item) => {
          transformedRoleStats[item.role] = asCount(
            item.count ?? item._count?.role
          );
        });

        const assignmentPayload = assignRes.data?.data;
        const assignments =
          typeof assignmentPayload === "number"
            ? { total: assignmentPayload }
            : {
                total: asCount(assignmentPayload?.total),
                pending:
                  assignmentPayload?.pending === undefined
                    ? undefined
                    : asCount(assignmentPayload.pending),
              };

        setOverview(overviewRes.data?.data || {});
        setRoleStats(transformedRoleStats);
        setAttendance(
          (attRes.data?.data || []).map((row) => ({
            status: row.status,
            count: asCount(row.count ?? row._count),
          }))
        );
        setAssignmentStats(assignments);
        setMonthlyResults(monthlyResultRes.data?.data || []);
        setError("");
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("Failed to load dashboard data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchStats();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const roleData = [
    { name: "Students", value: roleStats.STUDENT || 0 },
    { name: "Teachers", value: roleStats.TEACHER || 0 },
    { name: "Admins", value: roleStats.ADMIN || 0 },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Enrolment, attendance, and results for the current school.
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Box display="flex" flexDirection="column" gap={2.5}>
          <Box
            display="grid"
            gap={2}
            sx={{
              gridTemplateColumns: {
                xs: "1fr 1fr",
                md: "repeat(4, 1fr)",
              },
            }}
          >
            {statItems.map((item) => (
              <Paper key={item.key} sx={{ p: 2.5 }}>
                <Typography variant="body2" color="text.secondary">
                  {item.label}
                </Typography>
                <Typography variant="h4">
                  {overview[item.key] ?? 0}
                </Typography>
              </Paper>
            ))}
          </Box>

          <Box
            display="grid"
            gap={2.5}
            sx={{ gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" } }}
          >
            <Paper sx={{ p: 3, minWidth: 0 }}>
              <Typography variant="h6" gutterBottom>
                People by role
              </Typography>
              <Box sx={{ width: "100%", height: 260 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={roleData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={84}
                      label
                    >
                      {roleData.map((entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Paper>

            <Paper sx={{ p: 3, minWidth: 0 }}>
              <Typography variant="h6" gutterBottom>
                Attendance
              </Typography>
              {attendance.length === 0 ? (
                <Typography color="text.secondary">
                  No attendance has been recorded yet.
                </Typography>
              ) : (
                <Box sx={{ width: "100%", height: 260 }}>
                  <ResponsiveContainer>
                    <BarChart data={attendance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="status" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#1B4F72" name="Records" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Assignments
              </Typography>
              <Typography variant="h4">{assignmentStats.total ?? 0}</Typography>
              <Typography color="text.secondary">Total assignments</Typography>
              {typeof assignmentStats.pending === "number" && (
                <Typography sx={{ mt: 2 }}>
                  Pending submissions: {assignmentStats.pending}
                </Typography>
              )}
            </Paper>

            <Paper sx={{ p: 3, minWidth: 0 }}>
              <Typography variant="h6" gutterBottom>
                Monthly results
              </Typography>
              {monthlyResults.length === 0 ? (
                <Typography color="text.secondary">
                  No monthly results yet.
                </Typography>
              ) : (
                <Box sx={{ width: "100%", height: 260 }}>
                  <ResponsiveContainer>
                    <BarChart data={monthlyResults}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="passed"
                        stackId="a"
                        fill="#148F77"
                        name="Passed"
                      />
                      <Bar
                        dataKey="failed"
                        stackId="a"
                        fill="#C0392B"
                        name="Failed"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </Paper>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Dashboard;
