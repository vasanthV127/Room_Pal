import { useState } from "react";
import "./App.css";
import Dashboard from './Components/Dashboard/Dashboard';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <Dashboard />
    </div>
  );
}

export default App;
