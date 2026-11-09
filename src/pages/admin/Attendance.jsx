import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import axios from "../../utils/axiosInstance";
import { getErrorMessage } from "../../utils/authUser";

function asCount(value) {
  if (typeof value === "number") return value;
  if (value && typeof value === "object") {
    if (typeof value._all === "number") return value._all;
    const numeric = Object.values(value).find((item) => typeof item === "number");
    return numeric ?? 0;
  }
  return 0;
}

const Attendance = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await axios.get("/admin/attendance-summary");
        const summary = (res.data?.data || []).map((row) => ({
          status: row.status,
          count: asCount(row.count ?? row._count),
        }));
        if (!cancelled) setRows(summary);
      } catch (err) {
        if (!cancelled) {
          setError(getErrorMessage(err, "Could not load attendance"));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Attendance
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        School-wide marks of present, absent, and leave.
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {loading ? (
        <CircularProgress />
      ) : (
        <Box display="grid" gap={2} sx={{ gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" } }}>
          <Paper sx={{ p: 3, minWidth: 0 }}>
            <Box sx={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <BarChart data={rows}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#1B4F72" name="Records" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Status</TableCell>
                  <TableCell>Records</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.status}>
                    <TableCell>{row.status}</TableCell>
                    <TableCell>{row.count}</TableCell>
                  </TableRow>
                ))}
                {rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2}>No attendance recorded</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
};

export default Attendance;
