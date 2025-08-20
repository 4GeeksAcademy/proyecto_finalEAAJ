import React, { useReducer } from 'react';
import { Link } from 'react-router-dom';
import BlogPostDetail from '../components/Blog/BlogPostDetail';
import AddNewPost from '../components/Blog/AddNewPost';
import ParallaxScroll from '../components/Blog/ParallaxScroll';
import { Footer } from '../components/Footer';
import '../components/Blog/Blog.css';
import '../components/Blog/ParallaxScroll.css';

// Importamos el store
import storeReducer, { initialStore } from "../store.js";

export const BlogPage = () => {
  const [store, dispatch] = useReducer(storeReducer, {}, initialStore);

  const handleAddPost = (post) => {
    dispatch({ type: "add_post", payload: { post } });
  };

  const handleAddComment = (postIndex, comment) => {
    dispatch({ type: "add_comment", payload: { postIndex, comment } });
  };

  const handleLike = (index) => {
    dispatch({ type: "like_post", payload: { index } });
  };

  const handleBack = () => {
    dispatch({ type: "set_selected_index", payload: { index: null } });
  };

  const handleShowAddForm = () => {
    dispatch({ type: "toggle_add_form" });
  };

  return (
    <div className="blog-container">
      {store.selectedIndex !== null ? (
        <>
          <BlogPostDetail
            post={store.posts[store.selectedIndex]}
            index={store.selectedIndex}
            handleLike={handleLike}
            handleAddComment={handleAddComment}
            onBack={handleBack}
          />
          <Footer />
        </>
      ) : store.showAddForm ? (
        <>
          <AddNewPost 
            onAddPost={handleAddPost} 
            onCancel={handleShowAddForm}
          />
          <Footer />
        </>
      ) : (
        <>
          <ParallaxScroll 
            posts={store.posts} 
            onPostSelect={(index) =>
              dispatch({ type: "set_selected_index", payload: { index } })
            } 
            onAddNewPostClick={handleShowAddForm}
          />
          <Footer />
        </>
      )}
    </div>
  );
};

export default BlogPage;
