import React, { useState } from 'react';
import './ProfilePic.css';

export const ProfilePic = ({ compact = false }) => {
  const [imageSrc, setImageSrc] = useState(
    'https://cdn.pixabay.com/photo/2017/08/06/21/01/louvre-2596278_960_720.jpg'
  );

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageSrc(URL.createObjectURL(file));
    }
  };

  return (
    <div className="profile-pic">
      <label className="-label" htmlFor="file">
        {!compact && (
          <>
            <span className="glyphicon glyphicon-camera"></span>
            <span>Change Image</span>
          </>
        )}
      </label>
      <input id="file" type="file" onChange={handleImageChange} />
      <img src={imageSrc} alt="Profile" />
    </div>
  );
};
