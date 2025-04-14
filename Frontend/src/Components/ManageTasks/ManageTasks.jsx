import "./ManageTasks.css";
import { useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Checkbox,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";

const ManageTasks = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      name: "Pay credit card bill",
      dueDate: "2025-04-20",
      priority: "high",
      completed: false,
    },
    {
      id: 2,
      name: "Review monthly budget",
      dueDate: "2025-04-25",
      priority: "medium",
      completed: false,
    },
    {
      id: 3,
      name: "File tax documents",
      dueDate: "2025-04-30",
      priority: "low",
      completed: false,
    },
  ]);
  const [newTask, setNewTask] = useState("");
  const [newPriority, setNewPriority] = useState("low");
  const [filter, setFilter] = useState("all");

  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasks([
        ...tasks,
        {
          id: tasks.length + 1,
          name: newTask,
          dueDate: "2025-05-01", // Placeholder
          priority: newPriority,
          completed: false,
        },
      ]);
      setNewTask("");
      setNewPriority("low");
    }
  };

  const handleToggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const filteredTasks =
    filter === "all" ? tasks : tasks.filter((task) => task.priority === filter);

  const completedCount = tasks.filter((task) => task.completed).length;
  const progress = tasks.length ? (completedCount / tasks.length) * 100 : 0;
  const motivationMessage =
    progress === 100
      ? "All tasks completed!"
      : progress > 50
      ? "Over halfway there!"
      : "Let’s get started!";

  return (
    <Container maxWidth="lg" className="manage-tasks">
      <Box sx={{ mb: { xs: 3, md: 4 }, textAlign: "center" }}>
        <Typography
          variant="h4"
          sx={{
            color: "#2DD4BF",
            fontFamily: "Poppins, sans-serif",
            fontWeight: 400,
            fontSize: { xs: "28px", md: "32px" },
          }}
        >
          Task Mosaic
        </Typography>
      </Box>
      <Box className="row g-3 mb-4">
        <Box className="col-12 col-md-4">
          <Box
            sx={{
              p: { xs: 2, md: 3 },
              border: "1px solid #E5E7EB",
              borderRadius: 2,
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                mb: 1,
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
                fontSize: { xs: "14px", md: "16px" },
                color: "#1F2937",
              }}
            >
              {Math.round(progress)}% Complete
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: "#E5E7EB",
                "& .MuiLinearProgress-bar": { backgroundColor: "#FBBF24" },
              }}
            />
            <Typography
              sx={{
                mt: 1,
                fontFamily: "Poppins, sans-serif",
                fontWeight: 300,
                fontSize: { xs: "12px", md: "14px" },
                color: "#6B7280",
              }}
            >
              {motivationMessage}
            </Typography>
          </Box>
        </Box>
        <Box className="col-12 col-md-8">
          <Box
            sx={{
              p: { xs: 2, md: 3 },
              border: "1px solid #E5E7EB",
              borderRadius: 2,
            }}
          >
            <Box className="d-flex flex-column flex-md-row gap-2 mb-3 align-items-md-end">
              <TextField
                variant="standard"
                label="New Task"
                placeholder="Add a financial task..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                fullWidth
                sx={{
                  mb: { xs: 2, md: 0 },
                  "& .MuiInputBase-input": {
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 400,
                    fontSize: { xs: "14px", md: "16px" },
                    padding: "8px 0",
                  },
                  "& .MuiInputLabel-root": {
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 400,
                    fontSize: { xs: "14px", md: "16px" },
                    color: "#6B7280",
                  },
                  "& .MuiInput-underline:before": {
                    borderBottomColor: "#E5E7EB",
                  },
                  "& .MuiInput-underline:hover:before": {
                    borderBottomColor: "#2DD4BF",
                  },
                  "& .MuiInput-underline:after": {
                    borderBottomColor: "#2DD4BF",
                  },
                }}
              />
              <FormControl sx={{ minWidth: { xs: "100%", md: 120 } }}>
                <InputLabel
                  sx={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 400,
                    fontSize: { xs: "14px", md: "16px" },
                    color: "#6B7280",
                  }}
                >
                  Priority
                </InputLabel>
                <Select
                  variant="standard"
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  label="Priority"
                  sx={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 400,
                    fontSize: { xs: "14px", md: "16px" },
                    "& .MuiSelect-select": {
                      padding: "8px 0",
                    },
                    "&:before": {
                      borderBottomColor: "#E5E7EB",
                    },
                    "&:hover:before": {
                      borderBottomColor: "#2DD4BF",
                    },
                    "&:after": {
                      borderBottomColor: "#2DD4BF",
                    },
                  }}
                >
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                className="btn btn-warning"
                onClick={handleAddTask}
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 400,
                  fontSize: { xs: "14px", md: "16px" },
                  backgroundColor: "#FBBF24",
                  padding: { xs: "8px 16px", md: "8px 16px" },
                  textTransform: "none",
                  width: { xs: "100%", md: "auto" },
                }}
              >
                Add
              </Button>
            </Box>
            <FormControl fullWidth>
              <InputLabel
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 400,
                  fontSize: { xs: "14px", md: "16px" },
                  color: "#6B7280",
                }}
              >
                Filter
              </InputLabel>
              <Select
                variant="standard"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                label="Filter"
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 400,
                  fontSize: { xs: "14px", md: "16px" },
                  "& .MuiSelect-select": {
                    padding: "8px 0",
                  },
                  "&:before": {
                    borderBottomColor: "#E5E7EB",
                  },
                  "&:hover:before": {
                    borderBottomColor: "#2DD4BF",
                  },
                  "&:after": {
                    borderBottomColor: "#2DD4BF",
                  },
                }}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="high">High Priority</MenuItem>
                <MenuItem value="medium">Medium Priority</MenuItem>
                <MenuItem value="low">Low Priority</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Box>
      <Box className="row g-3">
        {filteredTasks.map((task) => (
          <Box
            key={task.id}
            className={`col-12 col-sm-6 col-md-${
              task.priority === "high" ? "6" : "4"
            }`}
          >
            <Card
              sx={{
                backgroundColor:
                  task.priority === "high"
                    ? "#FEE2E2"
                    : task.priority === "medium"
                    ? "#FFEDD5"
                    : "#D1FAE5",
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <CardContent className="d-flex align-items-center">
                <Checkbox
                  checked={task.completed}
                  onChange={() => handleToggleComplete(task.id)}
                  sx={{
                    color: "#FBBF24",
                    "&.Mui-checked": { color: "#FBBF24" },
                  }}
                />
                <Box>
                  <Typography
                    sx={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 400,
                      fontSize: { xs: "16px", md: "18px" },
                      textDecoration: task.completed ? "line-through" : "none",
                      color: "#1F2937",
                    }}
                  >
                    {task.name}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 300,
                      fontSize: "14px",
                      color: "#6B7280",
                    }}
                  >
                    Due: {task.dueDate} | {task.priority.toUpperCase()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default ManageTasks;
