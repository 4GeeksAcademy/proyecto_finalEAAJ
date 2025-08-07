import React from 'react';

export const BlogPostCard = ({ post, index, onSelect }) => {
  return (
    <div 
      className={`post-card ${index % 3 === 0 ? 'reset-s' : ''}`} 
      onClick={onSelect}
    >
      <div 
        className="post-card-inner"
        style={{ backgroundImage: `url(${post.image})` }}
      >
        <h3>{post.title}</h3>
        <p>{post.body[0].substring(0, 66)}...</p>
        <div className="post-stats">
          <span className="fa fa-comment"> {post.comments.length}</span>
          <span className="fa fa-heart"> {post.likes}</span>
        </div>
      </div>
    </div>
  );
};