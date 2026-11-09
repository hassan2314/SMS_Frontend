import { useState } from "react";
import {
  Paper,
  Typography,
  Alert,
  Stack,
  Button,
  MenuItem,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import axios from "../../utils/axiosInstance";
import { getErrorMessage } from "../../utils/authUser";

const roles = ["TEACHER", "STUDENT", "ADMIN"];

const AddUser = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { control, handleSubmit } = useForm();

  const createUser = async (data) => {
    setError("");
    setSubmitting(true);
    try {
      await axios.post("/users/register", data);
      navigate("/admin/users");
    } catch (err) {
      setError(getErrorMessage(err, "Could not add the user"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper elevation={0} sx={{ p: { xs: 2, sm: 4 }, maxWidth: 560 }}>
      <Stack spacing={2}>
        <Typography variant="h4">Add user</Typography>
        <Typography color="text.secondary">
          Creates a sign-in for a teacher, student, or administrator. You stay
          signed in as yourself.
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <form onSubmit={handleSubmit(createUser)}>
          <Stack spacing={2}>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Name is required" }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Name"
                  fullWidth
                  required
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email format",
                },
              }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Email"
                  type="email"
                  fullWidth
                  required
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              rules={{ required: "Password is required" }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Password"
                  type="password"
                  autoComplete="new-password"
                  fullWidth
                  required
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="dob"
              control={control}
              rules={{ required: "Date of birth is required" }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Date of Birth"
                  type="date"
                  fullWidth
                  slotProps={{ inputLabel: { shrink: true } }}
                  required
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="role"
              control={control}
              rules={{ required: "Role is required" }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Role"
                  select
                  fullWidth
                  required
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                >
                  {roles.map((role) => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            <Stack direction="row" spacing={1}>
              <Button variant="contained" type="submit" disabled={submitting}>
                {submitting ? "Saving…" : "Add user"}
              </Button>
              <Button onClick={() => navigate("/admin/users")}>Cancel</Button>
            </Stack>
          </Stack>
        </form>
      </Stack>
    </Paper>
  );
};

export default AddUser;
