import './AccessComunityForum.css';

const AccessComunityForum = () => {
  // Sample data for forum posts
  const forumPosts = [
    { id: 1, author: 'Emily Parker', content: 'What strategies do you use for emergency fund planning?', replies: 12 },
    { id: 2, author: 'Marcus Johnson', content: 'Has anyone tried the 50/30/20 budget rule?', replies: 8 }
  ];

  return (
    <div className="finances-forum">
      <h2>Finances Forum</h2>
      <div className="forum-container">
        {forumPosts.map(post => (
          <div key={post.id} className="forum-post">
            <div className="post-author">{post.author}</div>
            <div className="post-content">{post.content}</div>
            <div className="post-stats">
              <span>{post.replies} replies</span>
              <button className="reply-btn">Reply</button>
            </div>
          </div>
        ))}
        <div className="new-post">
          <textarea placeholder="Share your financial insights or questions..."></textarea>
          <button className="post-btn">Post</button>
        </div>
      </div>
    </div>
  );
};

export default AccessComunityForum;