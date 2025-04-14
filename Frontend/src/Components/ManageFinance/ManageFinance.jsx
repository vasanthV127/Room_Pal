import { useState, useEffect } from "react";
import axios from "axios";
import "./ManageFinance.css";

const ManageFinance = () => {
  const [roommates, setRoommates] = useState([]);
  const [debtsOwed, setDebtsOwed] = useState([]);
  const [debtsToPay, setDebtsToPay] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId =  localStorage.getItem('userId'); // e.g., "2" for Purushoth
  const roomId = 1; // Room ID 1 (Flat 101)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch room member IDs
        const membersResponse = await axios.get(
          `http://192.168.137.1:8080/api/rooms/${roomId}/members`
        );
        // Fetch user details for each member
        const memberPromises = membersResponse.data
          .filter((id) => id !== parseInt(userId))
          .map((id) => axios.get(`http://192.168.137.1:8080/api/users/${id}`));
        const memberResponses = await Promise.all(memberPromises);
        const roommatesData = memberResponses.map((res) => res.data);

        // Fetch debts owed to user and debts to pay
        const debtsOwedResponse = await axios.get(
          `http://192.168.137.1:8080/api/expenses/debts-owed?userId=${userId}&roomId=${roomId}`
        );
        const debtsToPayResponse = await axios.get(
          `http://192.168.137.1:8080/api/expenses/debts-to-pay?userId=${userId}&roomId=${roomId}`
        );

        setRoommates(roommatesData);
        setDebtsOwed(debtsOwedResponse.data);
        setDebtsToPay(debtsToPayResponse.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load data. Please try again.");
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    } else {
      setError("Please log in to view finances.");
      setLoading(false);
    }
  }, [userId]);

  // Calculate net balance for a roommate
  const getNetBalance = (roommateId) => {
    const owedToUser = debtsOwed
      .filter((debt) => debt.debtorId === roommateId)
      .reduce((sum, debt) => sum + debt.amount, 0);
    const owedByUser = debtsToPay
      .filter((debt) => debt.creditorId === roommateId)
      .reduce((sum, debt) => sum + debt.amount, 0);
    return (owedToUser - owedByUser).toFixed(2);
  };

  if (loading) {
    return <div className="manage-finances">Loading...</div>;
  }

  if (error) {
    return <div className="manage-finances">{error}</div>;
  }

  return (
    <div className="manage-finances">
      <h2>Manage Finances</h2>
      <div className="finance-summary">
        {roommates.length === 0 ? (
          <p>No roommates found.</p>
        ) : (
          roommates.map((roommate) => {
            const balance = getNetBalance(roommate.id);
            return (
              <div key={roommate.id} className="summary-card">
                <h3>{roommate.username}</h3>
                <p
                  className={`amount ${
                    balance >= 0 ? "amount-positive" : "amount-negative"
                  }`}
                >
                  ${Math.abs(balance)}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ManageFinance;