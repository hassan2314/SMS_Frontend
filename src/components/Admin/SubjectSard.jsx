import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const SubjectCard = ({ subject, onEdit, onDelete }) => {
  return (
    <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {subject.name}
        </Typography>

        {subject.className && (
          <Typography variant="body2" color="text.secondary">
            Class: {subject.className}
          </Typography>
        )}

        {subject.teacherName && (
          <Typography variant="body2" color="text.secondary">
            Teacher: {subject.teacherName}
          </Typography>
        )}

        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <IconButton color="primary" onClick={() => onEdit(subject)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => onDelete(subject.id)}>
            <DeleteIcon />
          </IconButton>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default SubjectCard;
