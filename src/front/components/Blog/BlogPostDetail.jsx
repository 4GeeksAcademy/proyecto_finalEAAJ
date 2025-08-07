import React from 'react';

export const BlogPostDetail = ({ post, onLike }) => (
  <div className="post-detail">
    <h2>{post.title}</h2>
    {post.image && <img src={post.image} alt={post.title} />}
    <cite>by {post.author} on {new Date(post.createdOn).toLocaleDateString()}</cite>
    
    <div className="post-content">
      {post.body.map((paragraph, i) => (
        <p key={i}>{paragraph}</p>
      ))}
    </div>
    
    <button className="like-button" onClick={onLike}>
      <i className="fa fa-heart"></i> {post.likes}
    </button>
  </div>
);