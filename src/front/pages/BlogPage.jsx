import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BlogPostDetail from '../components/Blog/BlogPostDetail';
import AddNewPost from '../components/Blog/AddNewPost';
import BlogPostPage from '../components/Blog/BlogPostPage';
import ParallaxScroll from '../components/Blog/ParallaxScroll';
import { Footer } from '../components/Footer';
import '../components/Blog/Blog.css';
import '../components/Blog/ParallaxScroll.css';
import initialPostsData from "../assets/img/BlogPosts.js";



export const  BlogPage = () => {
  const [posts, setPosts] = useState(initialPostsData);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddPost = (post) => {
    const newPost = {
      ...post,
      body: post.body.split('\n'),
      comments: [],
      likes: 0,
      createdOn: Date.now(),
      image: post.image || 'https://placehold.co/600x400'
    };
    setPosts([newPost, ...posts]);
    setShowAddForm(false);
  };

  const handleAddComment = (postIndex, comment) => {
    const updatedPosts = [...posts];
    updatedPosts[postIndex].comments.push({ 
      ...comment, 
      createdOn: Date.now() 
    });
    setPosts(updatedPosts);
  };

  const handleLike = (index) => {
    const updatedPosts = [...posts];
    updatedPosts[index].likes++;
    setPosts(updatedPosts);
  };


  return (
    <div className="blog-container">
      {selectedIndex !== null ? (
        <>
          <BlogPostDetail
            post={posts[selectedIndex]}
            index={selectedIndex}
            handleLike={handleLike}
            handleAddComment={handleAddComment}
            onBack={() => setSelectedIndex(null)}
          />
          <Footer />
        </>
      ) : showAddForm ? (
        <>
          <AddNewPost 
            onAddPost={handleAddPost} 
            onCancel={() => setShowAddForm(false)}
          />
          <Footer />
        </>
      ) : (
        <>
          <div className="parallax-header">
            <Link to="/main" className="blog-title-link">
              <h1>Mo'Money Blog</h1>
            </Link>
            <button 
              className="floating-add-btn"
              onClick={() => setShowAddForm(true)}
              aria-label="Add new post"
            >
              +
            </button>
          </div>
          <ParallaxScroll 
            posts={posts} 
            onPostSelect={setSelectedIndex} 
            onAddNewPostClick={() => setShowAddForm(true)}  // <--- Aquí el cambio
          />
          <Footer />
        </>
      )}
    </div>
  );
}

export default BlogPage;
