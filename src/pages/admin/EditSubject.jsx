import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../utils/axiosInstance";
import {
  Button,
  TextField,
  MenuItem,
  Paper,
  Typography,
  CircularProgress,
  Box,
  Stack,
} from "@mui/material";

const EditSubject = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    classId: "",
    teacherId: "",
  });

  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch subject details
        const subjectRes = await axios.get(`/subjects/${id}`);
        const subject = subjectRes.data.data;

        setFormData({
          name: subject.name,
          classId: subject.class?.id || "",
          teacherId: subject.teacher?.id || "",
        });

        // Fetch all classes
        const classRes = await axios.get(`/classes`);
        setClasses(classRes.data.data);

        // Fetch all teachers
        const teacherRes = await axios.get(`/teachers`);
        setTeachers(teacherRes.data.data);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching subject details", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/subjects/${id}`, formData);
      navigate("/admin/subjects");
    } catch (error) {
      console.error("Error updating subject", error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Edit Subject
      </Typography>

      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {/* Subject Name */}
          <TextField
            label="Subject Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
          />

          {/* Class Dropdown */}
          <TextField
            select
            label="Class"
            name="classId"
            value={formData.classId}
            onChange={handleChange}
            fullWidth
            required
          >
            {classes.map((cls) => (
              <MenuItem key={cls.id} value={cls.id}>
                {cls.name}
              </MenuItem>
            ))}
          </TextField>

          {/* Teacher Dropdown */}
          <TextField
            select
            label="Teacher"
            name="teacherId"
            value={formData.teacherId}
            onChange={handleChange}
            fullWidth
            required
          >
            {teachers.map((teacher) => (
              <MenuItem key={teacher.id} value={teacher.id}>
                {teacher.user?.name}
              </MenuItem>
            ))}
          </TextField>

          {/* Submit Button */}
          <Box textAlign="right">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ px: 4 }}
            >
              Update Subject
            </Button>
          </Box>
        </Stack>
      </form>
    </Paper>
  );
};

export default EditSubject;
