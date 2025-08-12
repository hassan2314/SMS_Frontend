import { useEffect, useState } from "react";
import {
  Grid,
  CircularProgress,
  Typography,
  Alert,
  Box,
  Skeleton,
} from "@mui/material";
import axiosInstance from "../../utils/axiosInstance";
import SubjectCard from "../../components/Admin/SubjectSard";
import { useNavigate } from "react-router-dom";

const AdminSubjects = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSubjects = async () => {
    try {
      setError("");
      const res = await axiosInstance.get("/subjects");
      const subjectsData = res.data.data || [];

      const subjectsWithAttendance = await Promise.all(
        subjectsData.map(async (sub) => {
          const baseData = {
            ...sub,
            className: sub.class?.name || "N/A",
            teacherName: sub.teacher?.user?.name || "N/A",
          };

          try {
            const attRes = await axiosInstance.get(
              `/attendances/subject/${sub.id}`
            );
            return {
              ...baseData,
              attendancePercentage: attRes.data?.data?.percentage ?? 0,
              present: attRes.data?.data?.present ?? 0,
              total: attRes.data?.data?.total ?? 0,
            };
          } catch (err) {
            console.error(
              `Error fetching attendance for subject ${sub.id}`,
              err
            );
            return {
              ...baseData,
              attendancePercentage: 0,
              present: 0,
              total: 0,
            };
          }
        })
      );

      setSubjects(subjectsWithAttendance);
    } catch (err) {
      console.error("Error fetching subjects:", err);
      setError("Failed to load subjects. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (subject) => {
    console.log("Edit subject", subject);
    // Navigate to edit page or open modal
    navigate(`/admin/edit/subjects/${subject.id}`);
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/subjects/${id}`);
      setSubjects((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete subject. Please try again.");
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  if (loading) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Subjects
        </Typography>
        <Grid container spacing={2}>
          {Array.from({ length: 6 }).map((_, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Skeleton variant="rectangular" height={120} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Subjects
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {subjects.length === 0 ? (
        <Typography variant="body1">No subjects found.</Typography>
      ) : (
        <Grid container spacing={2}>
          {subjects.map((subject) => (
            <Grid item xs={12} sm={6} md={4} key={subject.id}>
              <SubjectCard
                subject={subject}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
};

export default AdminSubjects;
