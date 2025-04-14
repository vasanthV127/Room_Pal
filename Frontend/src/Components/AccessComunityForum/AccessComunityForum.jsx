import React, { useState, useEffect, Component } from 'react';
import './AccessComunityForum.css';

// Error Boundary Component
class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="finances-forum error">
          <h2>Error</h2>
          <p>Something went wrong: {this.state.error?.message || 'Unknown error'}</p>
          <button
            className="post-btn"
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const AccessComunityForum = () => {
  const [sessionId, setSessionId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [poll, setPoll] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState(null);
  const username = localStorage.getItem('username');
  // Attempt login on mount using localStorage
  useEffect(() => {
    const attemptLogin = async () => {
     
      if (!username) {
        setError('No username found in localStorage. Please set localStorage.setItem("username", "Akash") or similar.');
        return;
      }

      try {
        const response = await fetch('http://127.0.0.1:5000/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password: 'pass' }),
          credentials: 'include',
        });
        const data = await response.json();
        console.log('Login response:', data);
        console.log(data.username);
        if (response.ok) {
          setSessionId(data.session_id);
          setCurrentUser(data.username);
          setError(null);
        } else {
          setError(data.error || 'Login failed: Invalid credentials');
        }
      } catch (err) {
        console.error('Login error:', err);
        setError(`Login failed: ${err.message}`);
      }
    };

    // Reset state and attempt login
    setSessionId(null);
    setCurrentUser(null);
    setMessages([]);
    setPoll(null);
    setShowResult(false);
    attemptLogin();
  }, []);

  // Fetch forum data every 5 seconds
  useEffect(() => {
    if (sessionId) {
      fetchForumData();
      const interval = setInterval(fetchForumData, 5000);
      return () => clearInterval(interval);
    }
  }, [sessionId]);

  const fetchForumData = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/forum?session_id=${sessionId}`, {
        credentials: 'include',
      });
      const data = await response.json();
      console.log(`Forum data for ${currentUser || 'user'}:`, data);
      if (response.ok) {
        setMessages(data.messages || []);
        setPoll(data.poll && Object.keys(data.poll).length ? { ...data.poll, votes: data.poll.votes || {} } : null);
        setCurrentUser(data.username);
      } else {
        console.error('Forum error:', data.error);
        setSessionId(null);
        setCurrentUser(null);
        setError(data.error || 'Failed to load forum');
      }
    } catch (error) {
      console.error('Error fetching forum data:', error);
      setSessionId(null);
      setCurrentUser(null);
      setError(`Failed to load forum: ${error.message}`);
    }
  };

  // Auto-scroll chat to bottom
  useEffect(() => {
    const chatBox = document.querySelector('.chat-box');
    if (chatBox) {
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  }, [messages]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch('http://127.0.0.1:5000/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setSessionId(null);
      setCurrentUser(null);
      setMessages([]);
      setPoll(null);
      setShowResult(false);
      setError('Logged out. Reload to log in again.');
    } catch (error) {
      console.error('Error logging out:', error);
      setError(`Logout failed: ${error.message}`);
    }
  };

  // Handle sending a message or initiating a poll
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await fetch(`http://127.0.0.1:5000/forum?session_id=${sessionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMessage }),
        credentials: 'include',
      });
      if (response.ok) {
        setNewMessage('');
        fetchForumData();
      } else {
        const data = await response.json();
        console.error('Error sending message:', data.error);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Handle poll voting
  const handleVote = async (vote) => {
    if (poll && poll.votes && !poll.votes[currentUser]) {
      try {
        const response = await fetch(`http://127.0.0.1:5000/forum?session_id=${sessionId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ vote }),
          credentials: 'include',
        });
        const data = await response.json();
        if (response.ok) {
          if (data.redirectToResult) {
            setShowResult(true);
          } else {
            fetchForumData();
          }
        } else {
          console.error('Error voting:', data.error);
        }
      } catch (error) {
        console.error('Error voting:', error);
      }
    }
  };

  // Render poll result and reset poll
  const renderResult = () => {
    if (!poll || !poll.product) return null;

    const yesVotes = Object.values(poll.votes || {}).filter((v) => v === 'yes').length;
    const recommended = yesVotes >= 2;

    return (
      <div className="poll-result">
        <h2>Poll Result for: {poll.product}</h2>
        <p>{recommended ? '✅ Majority voted YES. Product is Recommended.' : '❌ Majority did not approve. Product is Not Recommended.'}</p>
        <p><strong>Buy Links:</strong></p>
        <div className="buy-links">
          {Object.entries(poll.links || {}).map(([site, url]) => (
            <div key={site} className="card">
              <a href={url} target="_blank" rel="noopener noreferrer">{site.replace('_', ' ')}</a>
            </div>
          ))}
        </div>
        <p>
          <button
            onClick={() => {
              setShowResult(false);
              setPoll(null);
              fetchForumData();
            }}
          >
            Back to Forum
          </button>
        </p>
      </div>
    );
  };

  // Show error if login fails or username is missing
  if (error) {
    return (
      <div className="finances-forum error">
        <h2>Error</h2>
        <p>{error}</p>
        <button
          className="post-btn"
          onClick={() => window.location.reload()}
        >
          Reload
        </button>
      </div>
    );
  }

  // Show loading while authenticating
  if (!sessionId || !currentUser) {
    return (
      <div className="finances-forum loading">
        <h2>Loading...</h2>
        <p>Attempting to log in with username from localStorage...</p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="finances-forum">
        <h2>Welcome {currentUser}</h2>
        <button onClick={handleLogout} className="post-btn">
          Logout
        </button>

        {showResult ? (
          renderResult()
        ) : (
          <>
            <div className="chat-box">
              {messages.map((msg, index) => (
                
                <div
                  key={index}
                  className={`message ${username === msg.user ? 'message-other' : 'message-own'}`}
                >
                  <strong> {msg.user}:</strong>
                  <span>{msg.content}</span>
                  
                </div>
              ))}
            </div>

            {poll && poll.product && (
              <div className="poll-box">
                <p><strong>🗳️ Poll on:</strong> <em>{poll.product}</em></p>
                <p><strong>Votes:</strong></p>
                <ul>
                  {Object.entries(poll.votes || {}).map(([voter, choice]) => (
                    <li key={voter}>
                      {voter} voted: <strong>{choice.toUpperCase()}</strong>
                    </li>
                  ))}
                </ul>
                {!(poll.votes && poll.votes[currentUser]) ? (
                  <div>
                    <button onClick={() => handleVote('yes')}>👍 Yes</button>
                    <button onClick={() => handleVote('no')}>👎 No</button>
                  </div>
                ) : (
                  <p><em>You have already voted.</em></p>
                )}
                <hr />
                <p><strong>Buy Links for {poll.product}:</strong></p>
                <div className="buy-links">
                  {Object.entries(poll.links || {}).map(([site, url]) => (
                    <div key={site} className="card">
                      <a href={url} target="_blank" rel="noopener noreferrer">{site.replace('_', ' ')}</a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSendMessage} className="new-post">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message or $buy product"
                required
              />
              <button type="submit" className="post-btn">Send</button>
            </form>
          </>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default AccessComunityForum;