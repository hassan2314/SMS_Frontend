import { Container, Paper, Typography, Stack } from "@mui/material";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Home = () => {
  const { user } = useSelector((state) => state.auth);

  if (user?.role === "ADMIN") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Stack spacing={2}>
          <Typography variant="h4">Welcome{user?.name ? `, ${user.name}` : ""}</Typography>
          <Typography color="text.secondary">
            You are signed in{user?.role ? ` as ${user.role}` : ""}. Admin tools
            are available to administrator accounts. Use Logout in the header to
            sign in as someone else.
          </Typography>
        </Stack>
      </Paper>
    </Container>
  );
};

export default Home;
