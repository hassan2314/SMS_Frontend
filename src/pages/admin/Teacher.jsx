import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
} from "@mui/material";
import axios from "../../utils/axiosInstance";
import { getErrorMessage } from "../../utils/authUser";

const AdminTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [dropRequests, setDropRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [teachersRes, dropRes] = await Promise.all([
          axios.get("/teachers"),
          axios.get("/subjectDrops"),
        ]);
        if (cancelled) return;
        setTeachers(teachersRes.data?.data || []);
        setDropRequests(dropRes.data?.data || []);
        setError("");
      } catch (err) {
        if (!cancelled) {
          setError(getErrorMessage(err, "Failed to load teacher data"));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Teachers
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Subject assignments and requests to drop a subject.
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Box display="flex" flexDirection="column" gap={3}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              All teachers
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Subjects</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {teachers.map((teacher) => (
                    <TableRow key={teacher.id}>
                      <TableCell>{teacher.user?.name || "Unknown"}</TableCell>
                      <TableCell>{teacher.user?.email || "—"}</TableCell>
                      <TableCell>
                        {(teacher.subjects || []).length === 0
                          ? "None assigned"
                          : teacher.subjects.map((subj) => (
                              <Typography key={subj.id || subj.name} variant="body2">
                                {subj.name}
                                {subj.class?.name ? ` (${subj.class.name})` : ""}
                              </Typography>
                            ))}
                      </TableCell>
                    </TableRow>
                  ))}
                  {teachers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3}>No teachers found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Subject drop requests
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Teacher</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Subject</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dropRequests.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell>{req.teacher?.user?.name || "Unknown"}</TableCell>
                      <TableCell>{req.teacher?.user?.email || "—"}</TableCell>
                      <TableCell>{req.subject?.name || "—"}</TableCell>
                      <TableCell>{req.status}</TableCell>
                    </TableRow>
                  ))}
                  {dropRequests.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4}>No drop requests</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default AdminTeachers;
