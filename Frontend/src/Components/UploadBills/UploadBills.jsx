import { useState, useEffect } from "react";
import axios from "axios";
import "./UploadBills.css";

const UploadBills = () => {
  const [file, setFile] = useState(null);
  const [roommates, setRoommates] = useState([]);
  const [suggestedPayer, setSuggestedPayer] = useState(null);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [manualExpense, setManualExpense] = useState({
    productName: "",
    rate: "",
    quantity: 1,
    date: new Date().toISOString().split("T")[0],
    payerId: "",
    splitUserIds: [],
  });
  const [error, setError] = useState("");
  const userId = localStorage.getItem("userId"); // e.g., "2" for Purushoth
  const roomId = 1; // Room ID 1 (Flat 101)

  // Fetch roommates and suggested payer
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch room members
        const membersResponse = await axios.get(
          `http://192.168.137.1:8080/api/rooms/${roomId}/members`
        );
        const memberPromises = membersResponse.data.map((id) =>
          axios.get(`http://192.168.137.1:8080/api/users/${id}`)
        );
        const memberResponses = await Promise.all(memberPromises);
        setRoommates(memberResponses.map((res) => res.data));

        // Fetch suggested payer
        const suggestionResponse = await axios.get(
          `http://192.168.137.1:8080/api/expenses/payer-suggestion?roomId=${roomId}`
        );
        setSuggestedPayer(suggestionResponse.data);

        // Set default payer
        setManualExpense((prev) => ({
          ...prev,
          payerId: suggestionResponse.data.userId.toString(),
          splitUserIds: membersResponse.data,
        }));
      } catch (err) {
        setError("Failed to load roommates or suggestion.");
      }
    };
    fetchData();
  }, []);

  // Handle file upload to Python service
  const handleFileUpload = async () => {
    if (!file) {
      setError("Please select a file.");
      return;
    }
    const formData = new FormData();
    formData.append("receipt", file);
    try {
      const response = await axios.post(
        "http://localhost:5000/analyze-receipt",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      const expenseData = response.data;
      const expense = {
        productName: expenseData.productName,
        rate: expenseData.rate,
        quantity: expenseData.quantity,
        date: expenseData.date,
        roomId,
        payerId: suggestedPayer.userId,
        splitUserIds: [expenseData.payerId], // Default to self
      };
      await submitExpense(expense);
      setFile(null);
    } catch (err) {
      setError("Failed to process receipt.");
    }
  };

  // Handle manual form changes
  const handleManualChange = (e) => {
    const { name, value } = e.target;
    setManualExpense((prev) => ({ ...prev, [name]: value }));
  };

  // Handle split user selection
  const handleSplitUserToggle = (userId) => {
    setManualExpense((prev) => {
      const splitUserIds = prev.splitUserIds.includes(userId)
        ? prev.splitUserIds.filter((id) => id !== userId)
        : [...prev.splitUserIds, userId];
      return { ...prev, splitUserIds };
    });
  };

  // Submit expense to backend
  const submitExpense = async (expense) => {
    try {
      const response = await axios.post(
        "http://192.168.137.1:8080/api/expenses",
        expense
      );
      const payer = roommates.find((r) => r.id === expense.payerId);
      const splitUsers = roommates.filter((r) =>
        expense.splitUserIds.includes(r.id)
      );
      setRecentExpenses((prev) => [
        {
          id: response.data.id,
          productName: expense.productName,
          amount: expense.rate * expense.quantity,
          date: expense.date,
          payerUsername: payer?.username || "Unknown",
          splitUsernames: splitUsers.map((u) => u.username).join(", "),
        },
        ...prev.slice(0, 4), // Keep last 5
      ]);
      setError("");
      setManualExpense({
        productName: "",
        rate: "",
        quantity: 1,
        date: new Date().toISOString().split("T")[0],
        payerId: suggestedPayer?.userId.toString() || "",
        splitUserIds: roommates.map((r) => r.id),
      });
    } catch (err) {
      setError("Failed to save expense.");
    }
  };

  // Handle manual form submission
  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!manualExpense.productName || !manualExpense.rate || !manualExpense.payerId) {
      setError("Please fill all required fields.");
      return;
    }
    const expense = {
      productName: manualExpense.productName,
      rate: parseFloat(manualExpense.rate),
      quantity: parseInt(manualExpense.quantity),
      date: manualExpense.date,
      roomId,
      payerId: parseInt(manualExpense.payerId),
      splitUserIds: manualExpense.splitUserIds.length
        ? manualExpense.splitUserIds.map(Number)
        : [parseInt(manualExpense.payerId)],
    };
    await submitExpense(expense);
  };

  return (
    <div className="upload-bills">
      <h2>Upload Bills</h2>
      <div className="upload-container">
        {/* File Upload */}
        <div className="upload-area">
          <div className="upload-icon"></div>
          <p>Drag and drop files here or click to upload</p>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ display: "none" }}
            id="fileInput"
          />
          <button
            className="browse-btn"
            onClick={() => document.getElementById("fileInput").click()}
          >
            Browse Files
          </button>
          {file && (
            <div>
              <p>Selected: {file.name}</p>
              <button className="browse-btn" onClick={handleFileUpload}>
                Upload Receipt
              </button>
            </div>
          )}
          {suggestedPayer && (
            <p className="suggestion">
              Suggested Payer: {suggestedPayer.username}
            </p>
          )}
        </div>

        {/* Manual Entry Form */}
        <h3>Manual Entry</h3>
        <form onSubmit={handleManualSubmit} className="manual-form">
          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              name="productName"
              value={manualExpense.productName}
              onChange={handleManualChange}
              placeholder="e.g., Movie"
            />
          </div>
          <div className="form-group">
            <label>Rate ($)</label>
            <input
              type="number"
              name="rate"
              value={manualExpense.rate}
              onChange={handleManualChange}
              placeholder="e.g., 12.00"
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              name="quantity"
              value={manualExpense.quantity}
              onChange={handleManualChange}
              min="1"
            />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={manualExpense.date}
              onChange={handleManualChange}
            />
          </div>
          <div className="form-group">
            <label>Payer</label>
            <select
              name="payerId"
              value={manualExpense.payerId}
              onChange={handleManualChange}
            >
              <option value="">Select Payer</option>
              {roommates.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Split With</label>
            <div className="split-users">
              {roommates.map((user) => (
                <label key={user.id} className="split-checkbox">
                  <input
                    type="checkbox"
                    checked={manualExpense.splitUserIds.includes(user.id)}
                    onChange={() => handleSplitUserToggle(user.id)}
                  />
                  {user.username}
                </label>
              ))}
            </div>
          </div>
          <button type="submit" className="submit-btn">
            Add Expense
          </button>
        </form>

        {/* Error Message */}
        {error && <p className="error">{error}</p>}

        {/* Recent Expenses */}
        <h3>Recent Uploads</h3>
        <div className="recent-uploads">
          {recentExpenses.length === 0 ? (
            <p>No recent expenses.</p>
          ) : (
            recentExpenses.map((expense) => (
              <div key={expense.id} className="bill-item">
                <div className="bill-icon"></div>
                <div className="bill-details">
                  <div className="bill-name">
                    {expense.payerUsername} buys {expense.productName} for{" "}
                    {expense.splitUsernames}
                  </div>
                  <div className="bill-amount">
                    ${expense.amount.toFixed(2)} | {expense.date}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadBills;