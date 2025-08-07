import React from 'react';
import { useParams } from 'react-router-dom';
import { BlogHeader, BlogCommentsList, BlogCommentForm } from '../components/blog';
import { useBlog } from '../hooks/useBlog';

export const BlogPostPage = () => {
  const { postId } = useParams();
  const { posts, likePost, addComment } = useBlog();
  const post = posts.find(p => p.id === parseInt(postId));

  if (!post) return <div>Post not found</div>;

  return (
    <div className="darkside-theme">
      <BlogHeader />
      
      <div className="post-detail">
        <h2>{post.title}</h2>
        {post.image && <img src={post.image} alt={post.title} />}
        <cite>by {post.author} on {new Date(post.createdOn).toLocaleDateString()}</cite>
        
        <div className="post-body">
          {post.body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        <button className="btn-like" onClick={() => likePost(posts.indexOf(post))}>
          <i className="fa fa-heart"> {post.likes}</i>
        </button>

        <BlogCommentsList comments={post.comments} />
        <BlogCommentForm onSubmit={(comment) => addComment(posts.indexOf(post), comment)} />
      </div>
    </div>
  );
};