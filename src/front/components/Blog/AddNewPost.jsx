import React, { useState } from 'react';


function AddNewPost({ onAddPost }) {
  const [formData, setFormData] = useState({ title: '', image: '', body: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title && formData.body && formData.image) {
      onAddPost(formData);
      setFormData({ title: '', image: '', body: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        className="form-control"
        type="text"
        placeholder="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />
      <input
        className="form-control"
        type="text"
        placeholder="Image URL"
        value={formData.image}
        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
      />
      <textarea
        className="form-control"
        placeholder="Post content"
        value={formData.body}
        onChange={(e) => setFormData({ ...formData, body: e.target.value })}
      />
      <button className="btn btn-success" type="submit">Add Post</button>
    </form>
  );
}

export default AddNewPost;
