import React from 'react';
import { formatDate } from '../../utils/blogHelpers';

export const BlogCommentsList = ({ comments }) => {
  return (
    <div className="comments-list">
      <h3>
        <i className="fa fa-comments"></i> Comments ({comments.length})
      </h3>
      
      {comments.length === 0 ? (
        <p>No comments yet. Be the first to comment!</p>
      ) : (
        <ul>
          {comments.map((comment, index) => (
            <li key={index} className="comment-item">
              <blockquote>"{comment.body}"</blockquote>
              <cite>
                - <strong>{comment.author}</strong> on {formatDate(comment.createdOn)}
              </cite>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};