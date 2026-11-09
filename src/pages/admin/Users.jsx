import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Link,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "../../utils/axiosInstance";
import { Link as RouterLink } from "react-router-dom";
import { getErrorMessage } from "../../utils/authUser";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filterRole, setFilterRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [attendanceDialogOpen, setAttendanceDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [attendanceData, setAttendanceData] = useState(null);
  const [attendanceError, setAttendanceError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/admin/users");
      setUsers(res.data.data || []);
      setError("");
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load users"));
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await axios.put(`/admin/users/${id}/role`, { role: newRole });
      setUsers((prev) =>
        prev.map((user) => (user.id === id ? { ...user, role: newRole } : user))
      );
    } catch (err) {
      setError(getErrorMessage(err, "Failed to update role"));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (err) {
      setError(getErrorMessage(err, "Failed to delete user"));
    }
  };

  const handleViewAttendance = async (user) => {
    try {
      setAttendanceError("");
      setAttendanceData(null);
      setSelectedStudent(user);
      setAttendanceDialogOpen(true);

      const studentsRes = await axios.get("/students");
      const match = (studentsRes.data?.data || []).find(
        (student) => student.userId === user.id
      );
      if (!match) {
        setAttendanceError("This account does not have a student record.");
        return;
      }

      const res = await axios.get(`/attendances/${match.id}`);
      setAttendanceData(res.data.data);
    } catch (err) {
      setAttendanceError(getErrorMessage(err, "Failed to fetch attendance"));
    }
  };

  const filteredUsers = filterRole
    ? users.filter((u) => u.role === filterRole)
    : users;

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography variant="h4">Users</Typography>
          <Typography color="text.secondary">
            Accounts that can sign in to the school.
          </Typography>
        </Box>

        <Button
          variant="contained"
          component={RouterLink}
          to="/admin/add-user"
          color="primary"
        >
          Add user
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <FormControl sx={{ mb: 2, minWidth: 200 }} size="small">
        <InputLabel>Filter by role</InputLabel>
        <Select
          value={filterRole}
          label="Filter by role"
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="STUDENT">Student</MenuItem>
          <MenuItem value="TEACHER">Teacher</MenuItem>
          <MenuItem value="ADMIN">Admin</MenuItem>
        </Select>
      </FormControl>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Link component={RouterLink} to={`/admin/users/${user.id}`}>
                      {user.name}
                    </Link>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      size="small"
                    >
                      <MenuItem value="STUDENT">Student</MenuItem>
                      <MenuItem value="TEACHER">Teacher</MenuItem>
                      <MenuItem value="ADMIN">Admin</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell align="right">
                    {user.role === "STUDENT" && (
                      <IconButton
                        color="primary"
                        aria-label={`Attendance for ${user.name}`}
                        onClick={() => handleViewAttendance(user)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    )}
                    <IconButton
                      color="error"
                      aria-label={`Delete ${user.name}`}
                      onClick={() => handleDelete(user.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog
        open={attendanceDialogOpen}
        onClose={() => setAttendanceDialogOpen(false)}
      >
        <DialogTitle>Attendance</DialogTitle>
        <DialogContent>
          {attendanceError ? (
            <Alert severity="error">{attendanceError}</Alert>
          ) : attendanceData ? (
            <DialogContentText>
              {selectedStudent?.name} is present{" "}
              {attendanceData.percentage ?? 0}% of the time
              {typeof attendanceData.present === "number" &&
                ` (${attendanceData.present} of ${attendanceData.total})`}
              .
            </DialogContentText>
          ) : (
            <CircularProgress />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAttendanceDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Users;
