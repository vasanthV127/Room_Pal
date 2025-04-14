import './UploadBills.css';

const UploadBills = () => {
  // Sample data for bills
  const bills = [
    { id: 1, name: 'Rent Payment', amount: 1200, dueDate: '2025-05-01' },
    { id: 2, name: 'Water Bill', amount: 45.75, dueDate: '2025-04-28' },
    { id: 3, name: 'Netflix Subscription', amount: 14.99, dueDate: '2025-04-22' }
  ];

  return (
    <div className="upload-bills">
      <h2>Upload Bills</h2>
      <div className="upload-container">
        <div className="upload-area">
          <div className="upload-icon"></div>
          <p>Drag and drop files here or click to upload</p>
          <button className="browse-btn">Browse Files</button>
        </div>
        <h3>Recent Uploads</h3>
        <div className="recent-uploads">
          {bills.map(bill => (
            <div key={bill.id} className="bill-item">
              <div className="bill-icon"></div>
              <div className="bill-details">
                <div className="bill-name">{bill.name}</div>
                <div className="bill-amount">${bill.amount.toFixed(2)} | Due: {bill.dueDate}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UploadBills;