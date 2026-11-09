import { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Alert,
  Stack,
  Button,
  MenuItem,
  TextField,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";
import axios from "../utils/axiosInstance";
import Logo from "../components/Logo";
import { getErrorMessage, routeForRole, toPublicUser } from "../utils/authUser";

const roles = ["TEACHER", "STUDENT"];

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { control, handleSubmit } = useForm();

  const createUser = async (data) => {
    setError("");
    setSubmitting(true);
    try {
      await axios.post("/users/register", data);
      const res = await axios.post("/users/login", {
        email: data.email,
        password: data.password,
      });
      const user = toPublicUser(res.data?.data?.user);
      dispatch(
        login({ accessToken: res.data?.data?.accessToken, user })
      );
      navigate(routeForRole(user?.role));
    } catch (err) {
      setError(getErrorMessage(err, "Could not create the account"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "safe center",
        py: 4,
      }}
    >
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: { xs: 3, sm: 4 } }}>
        <Stack spacing={2} alignItems="center">
          <Logo width="72" />
          <Typography variant="h5" align="center">
            Create an account
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#1B4F72" }}>
              Sign in
            </Link>
          </Typography>
          {error && (
            <Alert severity="error" sx={{ width: "100%" }}>
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit(createUser)} style={{ width: "100%" }}>
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
                    autoComplete="email"
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

              <Button
                variant="contained"
                type="submit"
                fullWidth
                disabled={submitting}
              >
                {submitting ? "Creating account…" : "Sign up"}
              </Button>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Container>
    </Box>
  );
};

export default Signup;
