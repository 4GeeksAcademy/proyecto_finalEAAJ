import React, { useState } from 'react';

function BlogPostDetail({ post, index, handleLike, handleAddComment }) {
  const [comment, setComment] = useState({ author: '', body: '' });

  const submitComment = (e) => {
    e.preventDefault();
    if (comment.body && comment.author) {
      handleAddComment(index, comment);
      setComment({ author: '', body: '' });
    }
  };

  return (
    <div className="post">
      <img src={post.image} alt={post.title} className="img-responsive" />
      <h2>{post.title}</h2>
      <p>{new Date(post.createdOn).toLocaleDateString()}</p>
      {post.body.map((line, i) => <p key={i}>{line}</p>)}

      <button className="btn btn-default" onClick={() => handleLike(index)}>
        <i className="fa fa-heart" /> Like ({post.likes})
      </button>

      <div className="comments">
      
      </div>
    </div>
  );
}

export default BlogPostDetail;
