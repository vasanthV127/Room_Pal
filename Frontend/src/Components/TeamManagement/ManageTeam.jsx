import { useState, useEffect } from "react";
import axios from "axios";
import "./ManageTeam.css";

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
        setError("Failed to load team data: " + (err.response?.data?.message || err.message));
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
      setError("Failed to create team: " + (err.response?.data?.message || err.message));
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
      setError("Failed to join team: " + (err.response?.data?.message || err.message));
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
      setError("Failed to update team name: " + (err.response?.data?.message || err.message));
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
      const newMemberId = response.data.memberIds[response.data.memberIds.length - 1];
      const newMemberResponse = await axios.get(
        `http://192.168.137.1:8080/api/users/${newMemberId}`
      );
      setMembers([...members, newMemberResponse.data]);
      setSuccess(`Added ${addUsername} to team!`);
      setAddUsername("");
      setError("");
    } catch (err) {
      setError("Failed to add member: " + (err.response?.data?.message || err.message));
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
      setError("Failed to remove member: " + (err.response?.data?.message || err.message));
    }
    setLoading(false);
  };

  if (loading && !members.length) {
    return <div className="manage-team">Loading...</div>;
  }

  return (
    <div className="manage-team">
      <h2>Manage Team</h2>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      {/* Create Team */}
      <div className="section">
        <h3>Create New Team</h3>
        <div className="form">
          <input
            type="text"
            placeholder="Team Name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            disabled={loading}
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
          />
          <button onClick={handleCreateTeam} disabled={loading}>
            Create Team
          </button>
        </div>
      </div>

      {/* Join Team */}
      <div className="section">
        <h3>Join Team</h3>
        <div className="form">
          <input
            type="text"
            placeholder="Invite Code"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            disabled={loading}
          />
          <button onClick={handleJoinTeam} disabled={loading}>
            Join Team
          </button>
        </div>
      </div>

      {/* Edit Team */}
      <div className="section">
        <h3>Edit Team Name</h3>
        <div className="form">
          <input
            type="text"
            placeholder="New Team Name"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            disabled={loading}
          />
          <button onClick={handleUpdateTeamName} disabled={loading}>
            Update Name
          </button>
        </div>
      </div>

      {/* Manage Members */}
      <div className="section">
        <h3>Team Members</h3>
        <div className="form">
          <input
            type="text"
            placeholder="Add Username"
            value={addUsername}
            onChange={(e) => setAddUsername(e.target.value)}
            disabled={loading}
          />
          <button onClick={handleAddMember} disabled={loading}>
            Add Member
          </button>
        </div>
        <div className="members">
          {members.length === 0 ? (
            <p>No members found.</p>
          ) : (
            members.map((member) => (
              <div key={member.id} className="member-card">
                <span>{member.username}</span>
                {member.id !== parseInt(userId) && (
                  <button
                    className="remove"
                    onClick={() => handleRemoveMember(member.id)}
                    disabled={loading}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageTeam;