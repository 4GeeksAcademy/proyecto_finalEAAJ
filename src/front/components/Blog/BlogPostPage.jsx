import React from 'react';

function BlogPostPage({ posts, setSelectedIndex }) {
  return (
    <div className="row">
      {posts.map((post, index) => (
        <div className="col-md-4 post" key={index} onClick={() => setSelectedIndex(index)}>
          <img src={post.image} alt={post.title} className="img-responsive" />
          <h2>{post.title}</h2>
          <p>{new Date(post.createdOn).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}
export default BlogPostPage;