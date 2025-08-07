// File: src/front/pages/BlogPage.jsx
import React, { useState } from 'react';
import BlogPostPage from '../components/Blog/BlogPostPage';
import BlogPostDetail from '../components/Blog/BlogPostDetail';
import AddNewPost from '../components/Blog/AddNewPost';
import '../components/Blog/Blog.css';
import initialPostsData from '../assets/img/our_data.js';

function BlogPage() {
  const [tab, setTab] = useState('blog');
  const [posts, setPosts] = useState(initialPostsData);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleAddPost = (post) => {
    const newPost = {
      ...post,
      body: post.body.split('\n'),
      comments: [],
      likes: 0,
      createdOn: Date.now()
    };
    setPosts([newPost, ...posts]);
    setTab('blog');
    setSelectedIndex(0);
  };

  const handleAddComment = (postIndex, comment) => {
    const updatedPosts = [...posts];
    updatedPosts[postIndex].comments.push({ ...comment, createdOn: Date.now() });
    setPosts(updatedPosts);
  };

  const handleLike = (index) => {
    const updatedPosts = [...posts];
    updatedPosts[index].likes++;
    setPosts(updatedPosts);
  };

  return (
    <div className="container-fluid">
      <div className="row topbar">
        <div className="col-xs-6">
          <h1 onClick={() => { setTab('blog'); setSelectedIndex(null); }}>
            Mo`<span>mo</span><br />ney
          </h1>
        </div>
        <div className="col-xs-6 text-right">
          <a
            role="button"
            data-bs-toggle="collapse"
            href="#collapseMenu"
            aria-expanded="false"
            aria-controls="collapseExample"
          >
            <span className="hidden-xs">MENU</span> <i className="fa fa-bars" />
          </a>
        </div>
      </div>

      <div className="collapse" id="collapseMenu">
        <div className="text-center">
          <ul className="menu">
            <li><h2><a href="#" onClick={() => { setTab('blog'); setSelectedIndex(null); }}>See All Posts</a></h2></li>
            <li><h2><a href="#" onClick={() => setTab('new')}>Add New Post</a></h2></li>
          </ul>
        </div>
      </div>

      <div className="row content">
        <aside className="hidden-xs hidden-sm col-md-2">
          <p>Mo`money mejores opciones para tu dinero</p>
        </aside>

        <div className="col-md-10">
          {tab === 'blog' && selectedIndex === null && (
            <BlogPostPage posts={posts} setSelectedIndex={setSelectedIndex} />
          )}

          {selectedIndex !== null && (
            <BlogPostDetail
              post={posts[selectedIndex]}
              index={selectedIndex}
              handleLike={handleLike}
              handleAddComment={handleAddComment}
            />
          )}

          {tab === 'new' && (
            <AddNewPost onAddPost={handleAddPost} />
          )}
        </div>
      </div>
    </div>
  );
}

export default BlogPage;
