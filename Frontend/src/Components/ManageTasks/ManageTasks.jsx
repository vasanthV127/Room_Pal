import './ManageTasks.css';

const ManageTasks = () => {
  // Sample data for tasks
  const tasks = [
    { id: 1, name: 'Pay credit card bill', dueDate: '2025-04-20' },
    { id: 2, name: 'Review monthly budget', dueDate: '2025-04-25' },
    { id: 3, name: 'File tax documents', dueDate: '2025-04-30' }
  ];

  return (
    <div className="manage-tasks">
      <h2>Manage Tasks</h2>
      <div className="tasks-container">
        <div className="add-task">
          <input type="text" placeholder="Add a new financial task..." />
          <button className="add-btn">Add</button>
        </div>
        <div className="tasks-list">
          {tasks.map(task => (
            <div key={task.id} className="task-item">
              <input type="checkbox" id={`task-${task.id}`} />
              <label htmlFor={`task-${task.id}`}>{task.name}</label>
              <div className="task-due">Due: {task.dueDate}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageTasks;