import React from 'react';

export const BlogMenu = ({ isOpen, onSelectTab }) => (
  <div className={`collapse ${isOpen ? 'show' : ''}`} id="collapseMenu">
    <div className="text-center">
      <ul className="menu">
        <li><h2><button onClick={() => onSelectTab('blog')}>See All Posts</button></h2></li>
        <li><h2><button onClick={() => onSelectTab('new')}>Add New Post</button></h2></li>
      </ul>
    </div>
  </div>
);