import React, { useState, useEffect } from 'react';
import './AccessComunityForum.css';

const AccessComunityForum = () => {
  // Hardcoded users (no login required)
  const users = ['Karthi', 'Vasanth', 'Akash', 'Purushoth'];
  const [currentUser] = useState(users[1]); // Default to first user for demo
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [poll, setPoll] = useState(null);
  const [showResult, setShowResult] = useState(false);

  // Simulate active users (for tracking votes)
  const [activeUsers] = useState(
    users.reduce((acc, user) => ({ ...acc, [user]: user }), {})
  );

  // Auto-scroll chat to bottom
  useEffect(() => {
    const chatBox = document.querySelector('.chat-box');
    if (chatBox) {
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  }, [messages]);

  // Handle sending a message or initiating a poll
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const time = new Date().toLocaleTimeString();
    if (newMessage.startsWith('$buy ')) {
      const product = newMessage.split('$buy ')[1].trim();
      if (product) {
        const query = product.replace(/\s+/g, '+');
        const links = {
          Amazon: `https://www.amazon.in/s?k=${query}`,
          Flipkart: `https://www.flipkart.com/search?q=${query}`,
          Google_Shopping: `https://www.google.com/search?tbm=shop&q=${query}`,
          Reliance_Digital: `https://www.reliancedigital.in/search?q=${query}`,
          Croma: `https://www.croma.com/search/?text=${query}`,
        };
        setPoll({ product, votes: {}, links });
        setMessages((prev) => [
          ...prev,
          { user: currentUser, content: newMessage, time },
        ]);
      }
    } else {
      setMessages((prev) => [
        ...prev,
        { user: currentUser, content: newMessage, time },
      ]);
    }
    setNewMessage('');
  };

  // Handle poll voting
  const handleVote = (vote) => {
    if (poll && !poll.votes[currentUser]) {
      const updatedPoll = {
        ...poll,
        votes: { ...poll.votes, [currentUser]: vote },
      };
      setPoll(updatedPoll);

      // Check if poll should end (3 votes threshold)
      if (Object.keys(updatedPoll.votes).length >= 3) {
        setShowResult(true);
      }
    }
  };

  // Render poll result and reset poll
  const renderResult = () => {
    if (!poll) return null;

    const yesVotes = Object.values(poll.votes).filter((v) => v === 'yes').length;
    const recommended = yesVotes >= 2;
    const resultMsg = recommended
      ? `✅ Product '${poll.product}' is recommended!`
      : `❌ Product '${poll.product}' is not recommended.`;

    // Add result to messages
    setMessages((prev) => [
      ...prev,
      { user: 'System', content: resultMsg, time: new Date().toLocaleTimeString() },
    ]);

    // Reset poll and result view
    setPoll(null);
    setShowResult(false);

    return (
      <div className="poll-result">
        <h2>Poll Result for: {poll.product}</h2>
        <p>{recommended ? '✅ Majority voted YES. Product is Recommended.' : '❌ Majority did not approve. Product is Not Recommended.'}</p>
        <p><strong>Buy Links:</strong></p>
        <div className="buy-links">
          {Object.entries(poll.links).map(([site, url]) => (
            <div key={site} className="card">
              <a href={url} target="_blank" rel="noopener noreferrer">{site.replace('_', ' ')}</a>
            </div>
          ))}
        </div>
        <p>
          <button onClick={() => setShowResult(false)}>Back to Forum</button>
        </p>
      </div>
    );
  };

  return (
    <div className="finances-forum">
      <h2>Welcome {currentUser}</h2>

      {showResult ? (
        renderResult()
      ) : (
        <>
          <div className="chat-box">
            {messages.map((msg, index) => (
              <p key={index}>
                <strong>[{msg.time}] {msg.user}:</strong> {msg.content}
              </p>
            ))}
          </div>

          {poll && (
            <div className="poll-box">
              <p><strong>🗳️ Poll on:</strong> <em>{poll.product}</em></p>
              <p><strong>Votes:</strong></p>
              <ul>
                {Object.entries(poll.votes).map(([voter, choice]) => (
                  <li key={voter}>
                    {voter} voted: <strong>{choice.toUpperCase()}</strong>
                  </li>
                ))}
              </ul>
              {!poll.votes[currentUser] ? (
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
                {Object.entries(poll.links).map(([site, url]) => (
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
  );
};

export default AccessComunityForum;