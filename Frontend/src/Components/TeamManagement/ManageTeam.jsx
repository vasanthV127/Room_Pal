import { useState, useEffect, Component } from "react";
import axios from "axios";
import "./ManageTeam.css";
import { Container, Row, Col, Card } from "react-bootstrap";
import {
  TextField,
  Alert,
  Button as MuiButton,
  Fade,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import { Typography } from "@mui/joy";
import DeleteIcon from "@mui/icons-material/Delete";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Custom MUI Theme with Poppins
const theme = createTheme({
  palette: {
    primary: {
      main: "#26A69A",
    },
    text: {
      primary: "#1A3C34",
    },
  },
  typography: {
    fontFamily: '"Poppins", serif',
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "6px",
            backgroundColor: "#F7F9FA",
            fontSize: "0.875rem",
            height: "36px",
            fontFamily: '"Poppins", serif',
            "& input": {
              padding: "8px 12px",
            },
            "&:hover fieldset": {
              borderColor: "#26A69A",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#26A69A",
            },
          },
          "& .MuiInputLabel-root": {
            fontSize: "0.875rem",
            fontFamily: '"Poppins", serif',
            transform: "translate(12px, 8px) scale(1)",
            "&.MuiInputLabel-shrink": {
              transform: "translate(12px, -6px) scale(0.75)",
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "6px",
          textTransform: "none",
          padding: "6px 12px",
          fontSize: "0.875rem",
          fontFamily: '"Poppins", serif',
          backgroundColor: "#26A69A",
          color: "#FFFFFF",
          minHeight: "36px",
          "&:hover": {
            backgroundColor: "#2FB5A6",
          },
          "&:disabled": {
            backgroundColor: "#B0BEC5",
            color: "#FFFFFF",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
          backgroundColor: "#FFFFFF",
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          padding: "4px 8px",
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontFamily: '"Poppins", serif',
          fontSize: "0.875rem",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          fontFamily: '"Poppins", serif',
          fontSize: "0.875rem",
        },
      },
    },
  },
});

// Error Boundary Component
class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Typography
          level="body2"
          sx={{
            color: "#1A3C34",
            textAlign: "center",
            fontFamily: '"Poppins", serif',
          }}
        >
          Unable to load members.
        </Typography>
      );
    }
    return this.props.children;
  }
}

const ManageTeam = () => {
  const [roomName, setRoomName] = useState("");
  const [description, setDescription] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [newRoomName, setNewRoomName] = useState("Flat 101");
  const [addUsername, setAddUsername] = useState("");
  const [members, setMembers] = useState([]);
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem("userId"); // e.g., "2" for Purushoth
  const roomId = 1; // Flat 101

  // Fetch username and members
  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        setError("Please log in.");
        return;
      }
      setLoading(true);
      try {
        // Fetch username
        const userResponse = await axios.get(
          `http://192.168.137.1:8080/api/users/${userId}`
        );
        setUsername(userResponse.data.username);

        // Fetch members
        const membersResponse = await axios.get(
          `http://192.168.137.1:8080/api/rooms/${roomId}/members`
        );
        const memberPromises = membersResponse.data.map((id) =>
          axios.get(`http://192.168.137.1:8080/api/users/${id}`)
        );
        const memberResponses = await Promise.all(memberPromises);
        setMembers(memberResponses.map((res) => res.data));

        // Fetch room name
        try {
          const roomResponse = await axios.get(
            `http://192.168.137.1:8080/api/rooms/${roomId}`
          );
          setNewRoomName(roomResponse.data.name || "Flat 101");
        } catch (err) {
          console.warn("Failed to fetch room name:", err.message);
        }

        setLoading(false);
      } catch (err) {
        setError(
          "Failed to load team data: " +
            (err.response?.data?.message || err.message)
        );
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  // Create team
  const handleCreateTeam = async () => {
    if (!roomName.trim() || !description.trim()) {
      setError("Please enter team name and description.");
      return;
    }
    setLoading(true);
    try {
      await axios.post("http://192.168.137.1:8080/api/rooms", {
        name: roomName,
        description,
      });
      setSuccess("Team created successfully!");
      setRoomName("");
      setDescription("");
      setError("");
    } catch (err) {
      setError(
        "Failed to create team: " + (err.response?.data?.message || err.message)
      );
    }
    setLoading(false);
  };

  // Join team
  const handleJoinTeam = async () => {
    if (!inviteCode.trim()) {
      setError("Please enter an invite code.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        `http://192.168.137.1:8080/api/rooms/join/${inviteCode}`,
        null,
        { params: { username } }
      );
      setSuccess("Joined team successfully!");
      setInviteCode("");
      setError("");
    } catch (err) {
      setError(
        "Failed to join team: " + (err.response?.data?.message || err.message)
      );
    }
    setLoading(false);
  };

  // Update team name
  const handleUpdateTeamName = async () => {
    if (!newRoomName.trim()) {
      setError("Please enter a team name.");
      return;
    }
    setLoading(true);
    try {
      await axios.put(`http://192.168.137.1:8080/api/rooms/${roomId}`, {
        name: newRoomName,
      });
      setSuccess("Team name updated successfully!");
      setError("");
    } catch (err) {
      setError(
        "Failed to update team name: " +
          (err.response?.data?.message || err.message)
      );
    }
    setLoading(false);
  };

  // Add member
  const handleAddMember = async () => {
    if (!addUsername.trim()) {
      setError("Please enter a username.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `http://192.168.137.1:8080/api/rooms/${roomId}/members`,
        null,
        { params: { username: addUsername } }
      );
      const newMemberId =
        response.data.memberIds[response.data.memberIds.length - 1];
      const newMemberResponse = await axios.get(
        `http://192.168.137.1:8080/api/users/${newMemberId}`
      );
      setMembers([...members, newMemberResponse.data]);
      setSuccess(`Added ${addUsername} to team!`);
      setAddUsername("");
      setError("");
    } catch (err) {
      setError(
        "Failed to add member: " + (err.response?.data?.message || err.message)
      );
    }
    setLoading(false);
  };

  // Remove member
  const handleRemoveMember = async (memberId) => {
    if (memberId === parseInt(userId)) {
      setError("Cannot remove yourself.");
      return;
    }
    setLoading(true);
    try {
      await axios.delete(
        `http://192.168.137.1:8080/api/rooms/${roomId}/members/${memberId}`
      );
      setMembers(members.filter((m) => m.id !== memberId));
      setSuccess("Member removed successfully!");
      setError("");
    } catch (err) {
      setError(
        "Failed to remove member: " +
          (err.response?.data?.message || err.message)
      );
    }
    setLoading(false);
  };

  if (loading && !members.length) {
    return <div className="manage-team">Loading...</div>;
  }

  return (
    // <div className="manage-team">
    //   <h2>Manage Team</h2>

    //   {error && <div className="error">{error}</div>}
    //   {success && <div className="success">{success}</div>}

    //   {/* Create Team */}
    //   <div className="section">
    //     <h3>Create New Team</h3>
    //     <div className="form">
    //       <input
    //         type="text"
    //         placeholder="Team Name"
    //         value={roomName}
    //         onChange={(e) => setRoomName(e.target.value)}
    //         disabled={loading}
    //       />
    //       <input
    //         type="text"
    //         placeholder="Description"
    //         value={description}
    //         onChange={(e) => setDescription(e.target.value)}
    //         disabled={loading}
    //       />
    //       <button onClick={handleCreateTeam} disabled={loading}>
    //         Create Team
    //       </button>
    //     </div>
    //   </div>

    //   {/* Join Team */}
    //   <div className="section">
    //     <h3>Join Team</h3>
    //     <div className="form">
    //       <input
    //         type="text"
    //         placeholder="Invite Code"
    //         value={inviteCode}
    //         onChange={(e) => setInviteCode(e.target.value)}
    //         disabled={loading}
    //       />
    //       <button onClick={handleJoinTeam} disabled={loading}>
    //         Join Team
    //       </button>
    //     </div>
    //   </div>

    //   {/* Edit Team */}
    //   <div className="section">
    //     <h3>Edit Team Name</h3>
    //     <div className="form">
    //       <input
    //         type="text"
    //         placeholder="New Team Name"
    //         value={newRoomName}
    //         onChange={(e) => setNewRoomName(e.target.value)}
    //         disabled={loading}
    //       />
    //       <button onClick={handleUpdateTeamName} disabled={loading}>
    //         Update Name
    //       </button>
    //     </div>
    //   </div>

    //   {/* Manage Members */}
    //   <div className="section">
    //     <h3>Team Members</h3>
    //     <div className="form">
    //       <input
    //         type="text"
    //         placeholder="Add Username"
    //         value={addUsername}
    //         onChange={(e) => setAddUsername(e.target.value)}
    //         disabled={loading}
    //       />
    //       <button onClick={handleAddMember} disabled={loading}>
    //         Add Member
    //       </button>
    //     </div>
    //     <div className="members">
    //       {members.length === 0 ? (
    //         <p>No members found.</p>
    //       ) : (
    //         members.map((member) => (
    //           <div key={member.id} className="member-card">
    //             <span>{member.username}</span>
    //             {member.id !== parseInt(userId) && (
    //               <button
    //                 className="remove"
    //                 onClick={() => handleRemoveMember(member.id)}
    //                 disabled={loading}
    //               >
    //                 Remove
    //               </button>
    //             )}
    //           </div>
    //         ))
    //       )}
    //     </div>
    //   </div>
    // </div>
    <ThemeProvider theme={theme}>
      <Container className="my-3">
        <Typography
          level="h3"
          sx={{
            color: "#1A3C34",
            fontWeight: 600,
            mb: 2,
            fontFamily: '"Poppins", serif',
          }}
        >
          Manage Team
        </Typography>

        {/* Error and Success Messages */}
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: "6px", py: 0.5 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert
            severity="success"
            sx={{ mb: 2, borderRadius: "6px", py: 0.5 }}
          >
            {success}
          </Alert>
        )}

        {/* Create Team */}
        <Fade in timeout={200}>
          <Card className="mb-3">
            <Card.Body className="p-3">
              <Typography
                level="h4"
                sx={{
                  color: "#1A3C34",
                  mb: 1.5,
                  fontFamily: '"Poppins", serif',
                }}
              >
                Create Team
              </Typography>
              <Row className="gx-2">
                <Col md={6} className="mb-2">
                  <TextField
                    fullWidth
                    label="Team Name"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    disabled={loading}
                    variant="outlined"
                    inputProps={{ "aria-label": "Team Name" }}
                  />
                </Col>
                <Col md={6} className="mb-2">
                  <TextField
                    fullWidth
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={loading}
                    variant="outlined"
                    inputProps={{ "aria-label": "Description" }}
                  />
                </Col>
                <Col xs={12}>
                  <MuiButton
                    onClick={handleCreateTeam}
                    disabled={loading}
                    fullWidth
                    aria-label="Create Team"
                  >
                    Create Team
                  </MuiButton>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Fade>

        {/* Join Team */}
        <Fade in timeout={300}>
          <Card className="mb-3">
            <Card.Body className="p-3">
              <Typography
                level="h4"
                sx={{
                  color: "#1A3C34",
                  mb: 1.5,
                  fontFamily: '"Poppins", serif',
                }}
              >
                Join Team
              </Typography>
              <Row className="gx-2">
                <Col md={8} className="mb-2">
                  <TextField
                    fullWidth
                    label="Invite Code"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    disabled={loading}
                    variant="outlined"
                    inputProps={{ "aria-label": "Invite Code" }}
                  />
                </Col>
                <Col md={4} className="mb-2">
                  <MuiButton
                    onClick={handleJoinTeam}
                    disabled={loading}
                    fullWidth
                    aria-label="Join Team"
                  >
                    Join Team
                  </MuiButton>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Fade>

        {/* Edit Team */}
        <Fade in timeout={400}>
          <Card className="mb-3">
            <Card.Body className="p-3">
              <Typography
                level="h4"
                sx={{
                  color: "#1A3C34",
                  mb: 1.5,
                  fontFamily: '"Poppins", serif',
                }}
              >
                Edit Team Name
              </Typography>
              <Row className="gx-2">
                <Col md={8} className="mb-2">
                  <TextField
                    fullWidth
                    label="New Team Name"
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    disabled={loading}
                    variant="outlined"
                    inputProps={{ "aria-label": "New Team Name" }}
                  />
                </Col>
                <Col md={4} className="mb-2">
                  <MuiButton
                    onClick={handleUpdateTeamName}
                    disabled={loading}
                    fullWidth
                    aria-label="Update Team Name"
                  >
                    Update Name
                  </MuiButton>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Fade>

        {/* Manage Members */}
        <Fade in timeout={500}>
          <Card className="mb-3">
            <Card.Body className="p-3">
              <Typography
                level="h4"
                sx={{
                  color: "#1A3C34",
                  mb: 1.5,
                  fontFamily: '"Poppins", serif',
                }}
              >
                Team Members
              </Typography>
              <Row className="gx-2">
                <Col md={8} className="mb-2">
                  <TextField
                    fullWidth
                    label="Add Username"
                    value={addUsername}
                    onChange={(e) => setAddUsername(e.target.value)}
                    disabled={loading}
                    variant="outlined"
                    inputProps={{ "aria-label": "Add Username" }}
                  />
                </Col>
                <Col md={4} className="mb-2">
                  <MuiButton
                    onClick={handleAddMember}
                    disabled={loading}
                    fullWidth
                    aria-label="Add Member"
                  >
                    Add Member
                  </MuiButton>
                </Col>
              </Row>
              <ErrorBoundary>
                <List sx={{ bgcolor: "#F7F9FA", borderRadius: "6px", p: 0.5 }}>
                  {members.length === 0 ? (
                    <Typography
                      level="body2"
                      sx={{
                        color: "#1A3C34",
                        p: 1,
                        fontFamily: '"Poppins", serif',
                      }}
                    >
                      No members found.
                    </Typography>
                  ) : (
                    members.map((member) => (
                      <ListItem
                        key={member.id}
                        sx={{
                          borderRadius: "6px",
                          "&:hover": {
                            bgcolor: "#E0E7FF",
                          },
                        }}
                      >
                        <ListItemText
                          primary={member.username}
                          sx={{
                            color: "#1A3C34",
                            fontFamily: '"Poppins", serif',
                          }}
                        />
                        {member.id !== parseInt(userId) && (
                          <IconButton
                            color="error"
                            onClick={() => handleRemoveMember(member.id)}
                            disabled={loading}
                            aria-label={`Remove ${member.username}`}
                            size="small"
                          >
                            <DeleteIcon sx={{ fontSize: "1rem" }} />
                          </IconButton>
                        )}
                      </ListItem>
                    ))
                  )}
                </List>
              </ErrorBoundary>
            </Card.Body>
          </Card>
        </Fade>
      </Container>
    </ThemeProvider>
  );
};

export default ManageTeam;
