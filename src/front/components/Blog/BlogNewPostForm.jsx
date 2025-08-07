import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

export const BlogNewPostForm = ({ onSubmit }) => {
  const [post, setPost] = useState({
    title: '',
    body: '',
    image: '',
    author: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(post);
  };

  return (
    <div className="new-post-form">
      <h2>Add New Post</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={post.title}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Content</label>
          <textarea
            name="body"
            value={post.body}
            onChange={handleChange}
            rows="8"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Featured Image URL</label>
          <input
            type="text"
            name="image"
            value={post.image}
            onChange={handleChange}
            placeholder="http://example.com/image.jpg"
          />
        </div>
        
        <div className="form-group">
          <label>Author Name</label>
          <input
            type="text"
            name="author"
            value={post.author}
            onChange={handleChange}
            required
          />
        </div>
        
        <button type="submit" className="submit-button">
          <FontAwesomeIcon icon={faPaperPlane} /> Publish Post
        </button>
      </form>
    </div>
  );
};