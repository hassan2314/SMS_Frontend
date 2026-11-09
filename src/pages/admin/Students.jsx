import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  MenuItem,
  Modal,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { Delete, Visibility } from "@mui/icons-material";
import axiosInstance from "../../utils/axiosInstance";
import { getErrorMessage } from "../../utils/authUser";

const PAGE_SIZE = 8;

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [classes, setClasses] = useState([]);
  const [filterClass, setFilterClass] = useState("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/students");
      const rows = res?.data?.data ?? [];
      setStudents(Array.isArray(rows) ? rows : []);
      setError("");
    } catch (err) {
      setStudents([]);
      setError(getErrorMessage(err, "Could not load students"));
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await axiosInstance.get("/classes");
      const rows = res?.data?.data;
      setClasses(Array.isArray(rows) ? rows : []);
    } catch (err) {
      setClasses([]);
      setError(getErrorMessage(err, "Could not load classes"));
    }
  };

  const handleDelete = async (student) => {
    if (!window.confirm("Delete this student and their login?")) return;
    try {
      await axiosInstance.delete(`/admin/users/${student.userId}`);
      setError("");
      fetchStudents();
    } catch (err) {
      setError(getErrorMessage(err, "Could not delete the student"));
    }
  };

  const handleAssignClass = async (studentId, classId) => {
    try {
      await axiosInstance.put(`/teachers/${studentId}/update-class`, {
        classId: classId || null,
      });
      setError("");
      fetchStudents();
    } catch (err) {
      setError(getErrorMessage(err, "Could not update the class"));
    }
  };

  const handleViewProfile = async (student) => {
    setProfileError("");
    setProfileLoading(true);
    setSelectedStudent(student);
    try {
      const [profileRes, attendanceRes] = await Promise.all([
        axiosInstance.get(`/students/${student.id}`),
        axiosInstance.get(`/attendances/${student.id}`),
      ]);

      setSelectedStudent({
        ...profileRes.data.data,
        attendance: attendanceRes.data.data,
      });
    } catch (err) {
      setProfileError(getErrorMessage(err, "Could not load this profile"));
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchClasses();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, filterClass]);

  const classNameById = useMemo(() => {
    const map = new Map();
    classes.forEach((item) => map.set(item.id, item.name));
    return map;
  }, [classes]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return students.filter((student) => {
      const name = student.user?.name?.toLowerCase() || "";
      const email = student.user?.email?.toLowerCase() || "";
      const matchesQuery =
        !query || name.includes(query) || email.includes(query);
      const matchesClass = !filterClass || student.classId === filterClass;
      return matchesQuery && matchesClass;
    });
  }, [students, search, filterClass]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <Box>
      <Typography variant="h4" mb={0.5}>
        Students
      </Typography>
      <Typography color="text.secondary" mb={2}>
        Search the roll, assign a class, or open a profile.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <Box display="flex" gap={2} mb={2} flexWrap="wrap">
        <TextField
          label="Search by name or email"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          value={filterClass}
          onChange={(e) => setFilterClass(e.target.value)}
          displayEmpty
          size="small"
          sx={{ minWidth: 180, bgcolor: "background.paper" }}
        >
          <MenuItem value="">All classes</MenuItem>
          {classes.map((cls) => (
            <MenuItem key={cls.id} value={cls.id}>
              {cls.name}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Class</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visible.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.user?.name || "Unknown"}</TableCell>
                  <TableCell>{student.user?.email || "—"}</TableCell>
                  <TableCell>
                    <Select
                      value={student.classId || ""}
                      onChange={(e) =>
                        handleAssignClass(student.id, e.target.value)
                      }
                      size="small"
                      displayEmpty
                      sx={{ minWidth: 160 }}
                    >
                      <MenuItem value="">Unassigned</MenuItem>
                      {classes.map((cls) => (
                        <MenuItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </MenuItem>
                      ))}
                      </Select>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      aria-label={`View ${student.user?.name || "student"}`}
                      onClick={() => handleViewProfile(student)}
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton
                      color="error"
                      aria-label={`Delete ${student.user?.name || "student"}`}
                      onClick={() => handleDelete(student)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {visible.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4}>No students found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Box mt={2} display="flex" alignItems="center">
        <Button
          disabled={currentPage === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Previous
        </Button>
        <Typography sx={{ mx: 1 }} variant="body2">
          Page {currentPage} of {totalPages}
        </Typography>
        <Button
          disabled={currentPage === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </Box>

      <Modal open={!!selectedStudent} onClose={() => setSelectedStudent(null)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            p: 3,
            width: { xs: "90%", sm: 420 },
            borderRadius: 2,
          }}
        >
          {profileLoading ? (
            <CircularProgress />
          ) : (
            <>
              <Typography variant="h6" mb={2}>
                {selectedStudent?.user?.name || "Student"}
              </Typography>
              {profileError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {profileError}
                </Alert>
              )}
              <Typography>Email: {selectedStudent?.user?.email || "—"}</Typography>
              <Typography>
                Class:{" "}
                {selectedStudent?.class?.name ||
                  classNameById.get(selectedStudent?.classId) ||
                  "Unassigned"}
              </Typography>
              {selectedStudent?.user?.createdAt && (
                <Typography>
                  Joined:{" "}
                  {new Date(selectedStudent.user.createdAt).toLocaleDateString()}
                </Typography>
              )}
              {selectedStudent?.attendance && (
                <Box mt={2}>
                  <Typography variant="subtitle1" fontWeight={700}>
                    Attendance
                  </Typography>
                  <Typography>
                    Present: {selectedStudent.attendance.present ?? 0} /{" "}
                    {selectedStudent.attendance.total ?? 0} (
                    {selectedStudent.attendance.percentage ?? 0}%)
                  </Typography>
                </Box>
              )}
              <Box mt={2} display="flex" justifyContent="flex-end">
                <Button onClick={() => setSelectedStudent(null)}>Close</Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
}
