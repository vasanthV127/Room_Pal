import { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
} from "@mui/material";
import "./Notifications.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");
  const userId = localStorage.getItem("userId"); // e.g., "2"

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `http://192.168.137.1:8080/api/notifications?userId=${userId}`
        );
        setNotifications(response.data);
      } catch (err) {
        setError("Failed to load notifications.");
      }
    };
    if (userId) {
      fetchNotifications();
    } else {
      setError("Please log in.");
    }
  }, [userId]);

  return (
    <Container maxWidth="lg" className="notifications">
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography
          variant="h4"
          sx={{
            color: "#2DD4BF",
            fontFamily: "Poppins, sans-serif",
            fontWeight: 400,
          }}
        >
          Notifications
        </Typography>
      </Box>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <List>
        {notifications.length === 0 ? (
          <Typography>No notifications.</Typography>
        ) : (
          notifications.map((notification) => (
            <ListItem key={notification.id} className="notification-item">
              <ListItemText
                primary={notification.message}
                secondary={new Date(notification.createdAt).toLocaleString()}
                primaryTypographyProps={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 400,
                  color: "#1F2937",
                }}
                secondaryTypographyProps={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 300,
                  color: "#6B7280",
                }}
              />
            </ListItem>
          ))
        )}
      </List>
    </Container>
  );
};

export default Notifications;