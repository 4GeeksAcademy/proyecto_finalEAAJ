import React, { useState } from "react";
import "./ProfileImageUploader.css";

export const ProfileImageUploader = ({ image, onImageChange }) => {
  const [preview, setPreview] = useState(image || "/user-profile.png");

  const loadFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const newPreview = URL.createObjectURL(file);
    setPreview(newPreview);
    onImageChange(newPreview); // comunica la imagen al componente padre
  };

  return (
    <div className="profile-pic">
      <label className="-label" htmlFor="file">
        <span className="glyphicon glyphicon-camera" />
        <span>Cambiar Imagen</span>
      </label>
      <input id="file" type="file" onChange={loadFile} />
      <img src={preview} id="output" width="200" alt="preview" />
    </div>
  );
};
