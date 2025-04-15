import { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./ManageFinance.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ManageFinance = () => {
  const [roommates, setRoommates] = useState([]);
  const [debtsOwed, setDebtsOwed] = useState([]);
  const [debtsToPay, setDebtsToPay] = useState([]);
  const [expenseSummary, setExpenseSummary] = useState([]);
  const [period, setPeriod] = useState("month");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem("userId"); // e.g., "2" for Purushoth
  const roomId = 1; // Room ID 1 (Flat 101)
  const MONTHLY_BUDGET = { team: 1000, self: 250 }; // $
  const DAILY_BUDGET = { team: 33.33, self: 10 }; // $

  const fetchData = async () => {
    try {
      // Fetch room members
      const membersResponse = await axios.get(
        `http://192.168.137.1:8080/api/rooms/${roomId}/members`
      );
      const memberPromises = membersResponse.data
        .filter((id) => id !== parseInt(userId))
        .map((id) => axios.get(`http://192.168.137.1:8080/api/users/${id}`));
      const memberResponses = await Promise.all(memberPromises);
      const roommatesData = memberResponses.map((res) => res.data);

      // Fetch debts
      const debtsOwedResponse = await axios.get(
        `http://192.168.137.1:8080/api/expenses/debts-owed?userId=${userId}&roomId=${roomId}`
      );
      const debtsToPayResponse = await axios.get(
        `http://192.168.137.1:8080/api/expenses/debts-to-pay?userId=${userId}&roomId=${roomId}`
      );

      // Fetch expense summary
      const summaryResponse = await axios.get(
        `http://192.168.137.1:8080/api/expenses/summary?roomId=${roomId}&userId=${userId}&period=${period}`
      );

      setRoommates(roommatesData);
      setDebtsOwed(debtsOwedResponse.data);
      setDebtsToPay(debtsToPayResponse.data);
      setExpenseSummary(summaryResponse.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load data: " + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchData();
    } else {
      setError("Please log in to view finances.");
      setLoading(false);
    }

    // Listen for debt payments
    const handleDebtPaid = () => {
      if (userId) {
        fetchData();
      }
    };
    window.addEventListener("debtPaid", handleDebtPaid);

    return () => {
      window.removeEventListener("debtPaid", handleDebtPaid);
    };
  }, [userId, period]);

  // Calculate net balance
  const getNetBalance = (roommateId) => {
    const owedToUser = debtsOwed
      .filter((debt) => debt.debtorId === roommateId)
      .reduce((sum, debt) => sum + debt.amount, 0);
    const owedByUser = debtsToPay
      .filter((debt) => debt.creditorId === roommateId)
      .reduce((sum, debt) => sum + debt.amount, 0);
    return (owedToUser - owedByUser).toFixed(2);
  };

  // Calculate savings
  const getSavings = () => {
    const teamTotal = expenseSummary.reduce((sum, entry) => sum + entry.team, 0);
    const selfTotal = expenseSummary.reduce((sum, entry) => sum + entry.self, 0);
    const teamSavings = period === "month" ? MONTHLY_BUDGET.team - teamTotal : 0;
    const selfSavings = period === "month" ? MONTHLY_BUDGET.self - selfTotal : 0;
    return { team: teamSavings.toFixed(2), self: selfSavings.toFixed(2) };
  };

  // Check thresholds
  const getThresholdStatus = () => {
    const selfTotal = expenseSummary.reduce((sum, entry) => sum + entry.self, 0);
    if (period === "month" && selfTotal > MONTHLY_BUDGET.self) {
      return `Warning: Monthly spending ($${selfTotal.toFixed(
        2
      )}) exceeds limit ($${MONTHLY_BUDGET.self})!`;
    }
    if (period === "day" && selfTotal > DAILY_BUDGET.self) {
      return `Warning: Daily spending ($${selfTotal.toFixed(
        2
      )}) exceeds limit ($${DAILY_BUDGET.self})!`;
    }
    return "";
  };

  // Chart data
  const chartData = {
    labels: expenseSummary.map((entry) => entry.period),
    datasets: [
      {
        label: "Team Expenses ($)",
        data: expenseSummary.map((entry) => entry.team),
        backgroundColor: "rgba(40, 167, 69, 0.6)",
      },
      {
        label: "Your Expenses ($)",
        data: expenseSummary.map((entry) => entry.self),
        backgroundColor: "rgba(251, 191, 36, 0.6)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: `Expenses by ${period}` },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "Amount ($)" } },
    },
  };

  if (loading) {
    return <div className="manage-finances">Loading...</div>;
  }

  if (error) {
    return <div className="manage-finances">{error}</div>;
  }

  const savings = getSavings();
  const thresholdStatus = getThresholdStatus();

  return (
    <div className="manage-finances">
      <h2>Manage Finances</h2>

      {/* Period Filter */}
      <div className="filter">
        <label>View by: </label>
        <select value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option value="day">Day</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>
      </div>

      {/* Threshold Alert */}
      {thresholdStatus && (
        <div className="threshold-alert">{thresholdStatus}</div>
      )}

      {/* Summary Cards */}
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

      {/* Visual Cards */}
      <div className="visual-cards">
        <div className="visual-card">
          <h3>Total Team Expenses</h3>
          <p>
            $
            {expenseSummary
              .reduce((sum, entry) => sum + entry.team, 0)
              .toFixed(2)}
          </p>
        </div>
        <div className="visual-card">
          <h3>Your Expenses</h3>
          <p>
            $
            {expenseSummary
              .reduce((sum, entry) => sum + entry.self, 0)
              .toFixed(2)}
          </p>
        </div>
        <div className="visual-card">
          <h3>Team Savings</h3>
          <p className={savings.team >= 0 ? "amount-positive" : "amount-negative"}>
            ${Math.abs(savings.team)}
          </p>
        </div>
        <div className="visual-card">
          <h3>Your Savings</h3>
          <p className={savings.self >= 0 ? "amount-positive" : "amount-negative"}>
            ${Math.abs(savings.self)}
          </p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="chart-container">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default ManageFinance;