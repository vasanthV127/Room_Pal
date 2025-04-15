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
  const [uploadedProducts, setUploadedProducts] = useState([]);
  const [predictedSplits, setPredictedSplits] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editExpense, setEditExpense] = useState({
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
        const roommatesData = memberResponses.map((res) => res.data);
        setRoommates(roommatesData);

        // Fetch suggested payer
        const suggestionResponse = await axios.get(
          `http://192.168.137.1:8080/api/expenses/payer-suggestion?roomId=${roomId}`
        );
        setSuggestedPayer(suggestionResponse.data);

        // Set default payer for manual form
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

  // Handle file upload to Flask
  const handleFileUpload = async () => {
    if (!file) {
      setError("Please select a file.");
      return;
    }
    const formData = new FormData();
    formData.append("receipt", file);
    try {
      const response = await axios.post(
        " http://172.19.111.210:5000/analyze-receipt",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      const { products, predictions } = response.data;
      setUploadedProducts(products);
      setPredictedSplits(predictions);
      setFile(null);
      setError("");
    } catch (err) {
      setError("Failed to process receipt: " + (err.response?.data?.error || err.message));
    }
  };

  // Handle manual form changes
  const handleManualChange = (e) => {
    const { name, value } = e.target;
    setManualExpense((prev) => ({ ...prev, [name]: value }));
  };

  // Handle split user selection for manual form
  const handleSplitUserToggle = (userId) => {
    setManualExpense((prev) => {
      const splitUserIds = prev.splitUserIds.includes(userId)
        ? prev.splitUserIds.filter((id) => id !== userId)
        : [...prev.splitUserIds, userId];
      return { ...prev, splitUserIds };
    });
  };

  // Handle edit form changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditExpense((prev) => ({ ...prev, [name]: value }));
  };

  // Handle split user selection for edit form
  const handleEditSplitUserToggle = (userId) => {
    setEditExpense((prev) => {
      const splitUserIds = prev.splitUserIds.includes(userId)
        ? prev.splitUserIds.filter((id) => id !== userId)
        : [...prev.splitUserIds, userId];
      return { ...prev, splitUserIds };
    });
  };

  // Submit expense to Spring backend
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
      return response.data;
    } catch (err) {
      setError("Failed to save expense: " + (err.response?.data?.message || err.message));
      throw err;
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
    setManualExpense({
      productName: "",
      rate: "",
      quantity: 1,
      date: new Date().toISOString().split("T")[0],
      payerId: suggestedPayer?.userId.toString() || "",
      splitUserIds: roommates.map((r) => r.id),
    });
  };

  // Select product to edit
  const handleSelectProduct = (product) => {
    const predictedPayerId = Object.keys(predictedSplits).find((userId) =>
      predictedSplits[userId].some((p) => p.product === product.productName)
    ) || suggestedPayer?.userId.toString() || "";
    const predictedSplitUserIds = Object.keys(predictedSplits)
      .filter((userId) =>
        predictedSplits[userId].some((p) => p.product === product.productName)
      )
      .map(Number);
    setSelectedProduct(product);
    setEditExpense({
      productName: product.productName,
      rate: product.rate.toString(),
      quantity: Math.round(product.quantity),
      date: new Date().toISOString().split("T")[0],
      payerId: predictedPayerId,
      splitUserIds: predictedSplitUserIds.length
        ? predictedSplitUserIds
        : roommates.map((r) => r.id),
    });
  };

  // Submit edited product
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editExpense.productName || !editExpense.rate || !editExpense.payerId) {
      setError("Please fill all required fields for the product.");
      return;
    }
    const expense = {
      productName: editExpense.productName,
      rate: parseFloat(editExpense.rate),
      quantity: parseInt(editExpense.quantity),
      date: editExpense.date,
      roomId,
      payerId: parseInt(editExpense.payerId),
      splitUserIds: editExpense.splitUserIds.length
        ? editExpense.splitUserIds.map(Number)
        : [parseInt(editExpense.payerId)],
    };
    await submitExpense(expense);
    setUploadedProducts((prev) =>
      prev.filter((p) => p.productName !== expense.productName)
    );
    setSelectedProduct(null);
    setEditExpense({
      productName: "",
      rate: "",
      quantity: 1,
      date: new Date().toISOString().split("T")[0],
      payerId: "",
      splitUserIds: [],
    });
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

        {/* Uploaded Products */}
        {uploadedProducts.length > 0 && (
  <div className="uploaded-products">
    <h3>Extracted Products</h3>
    <div className="products-grid">
      {uploadedProducts.map((product, index) => (
        <div key={index} className="product-card">
          <div className="product-details">
            <div className="product-name">{product.productName}</div>
            <div className="product-info">
              Amount: ₹{product.amount.toFixed(2)} | Rate: ₹{product.rate.toFixed(2)} | Quantity: {product.quantity}
            </div>
            <div className="product-prediction">
              Predicted Payer: {roommates.find((r) => r.id === parseInt(Object.keys(predictedSplits).find((userId) => predictedSplits[userId].some((p) => p.product === product.productName))))?.username || "None"}
              <br />
              Split With: {Object.keys(predictedSplits)
                .filter((userId) => predictedSplits[userId].some((p) => p.product === product.productName))
                .map((userId) => roommates.find((r) => r.id === parseInt(userId))?.username)
                .filter(Boolean)
                .join(", ") || "None"}
            </div>
          </div>
          <button
            className="edit-btn"
            onClick={() => handleSelectProduct(product)}
          >
            Edit
          </button>
        </div>
      ))}
    </div>
  </div>
)}

        {/* Edit Product Form */}
        {selectedProduct && (
          <div className="edit-form">
            <h3>Edit Product: {selectedProduct.productName}</h3>
            <form onSubmit={handleEditSubmit} className="manual-form">
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  name="productName"
                  value={editExpense.productName}
                  onChange={handleEditChange}
                  placeholder="e.g., Mango"
                />
              </div>
              <div className="form-group">
                <label>Rate (₹)</label>
                <input
                  type="number"
                  name="rate"
                  value={editExpense.rate}
                  onChange={handleEditChange}
                  placeholder="e.g., 120.76"
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={editExpense.quantity}
                  onChange={handleEditChange}
                  min="1"
                />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  name="date"
                  value={editExpense.date}
                  onChange={handleEditChange}
                />
              </div>
              <div className="form-group">
                <label>Payer</label>
                <select
                  name="payerId"
                  value={editExpense.payerId}
                  onChange={handleEditChange}
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
                        checked={editExpense.splitUserIds.includes(user.id)}
                        onChange={() => handleEditSplitUserToggle(user.id)}
                      />
                      {user.username}
                    </label>
                  ))}
                </div>
              </div>
              <button type="submit" className="submit-btn">
                Submit Expense
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setSelectedProduct(null)}
              >
                Cancel
              </button>
            </form>
          </div>
        )}

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
            <label>Rate (₹)</label>
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
                  ₹{expense.amount.toFixed(2)} | {expense.date}
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