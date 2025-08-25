import React, { useReducer , useEffect } from "react";
import { Link } from 'react-router-dom';
import BlogPostDetail from '../components/Blog/BlogPostDetail';
import AddNewPost from '../components/Blog/AddNewPost';
import ParallaxScroll from '../components/Blog/ParallaxScroll';
import { Footer } from '../components/Footer';
import '../components/Blog/Blog.css';
import '../components/Blog/ParallaxScroll.css';
import storeReducer, { initialStore } from "../store.js";

export const BlogPage = () => {
  const [store, dispatch] = useReducer(storeReducer, {}, initialStore);

  // 🔹 Cargar posts desde API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_BACKEND_URL + "api/articulo/");
        const data = await res.json();

        const articulos = data.articulos;

        // Para cada artículo, traemos sus links
        const posts = await Promise.all(
          articulos.map(async (art) => {
            const resLinks = await fetch(import.meta.env.VITE_BACKEND_URL + `api/articulo/${art.id}/links`);
            const dataLinks = await resLinks.json();
            const links = dataLinks.links;

            return {
              id: art.id,
              title: art.titulo,
              autor: art.autor,
              body: art.texto ? art.texto.split("\n") : [],
              likes: art.likes,
              createdOn: art.fecha,
              image: links.length > 0 ? links[0].imagen : "https://placehold.co/600x400",
              enlace: links.length > 0 ? links[0].enlace : null,
              //comments: [] // si luego agregas comentarios, aquí encajarían
            };
          })
        );

        dispatch({ type: "set_posts", payload: { posts } });
      } catch (err) {
        console.error("Error cargando posts:", err);
      }
    };

    fetchPosts();
  }, []);

  const handleAddPost = (post) => {
    dispatch({ type: "add_post", payload: { post } });
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
            onBack={handleBack}
          />
          <Footer />
        </>
      ) : store.showAddForm ? (
        <>
          <AddNewPost onAddPost={handleAddPost} onCancel={handleShowAddForm} />
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
/* import BlogPostDetail from '../components/Blog/BlogPostDetail';
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

  /* const handleAddComment = (postIndex, comment) => {
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
            //handleAddComment={handleAddComment}
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

export default BlogPage; */
