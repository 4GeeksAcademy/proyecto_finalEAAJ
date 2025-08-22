import { useState, useEffect } from "react";
import Loader from "../pages/Loader.jsx";
import { BiBorderRadius } from "react-icons/bi";

export default function ImageViewer({ image, onImageChange }) {
  const [url, setUrl] = useState(image || "");
  const [imageSrc, setImageSrc] = useState(image || "");

  useEffect(() => {
    if (url && isValidImageUrl(url)) {
      setImageSrc(url);
      if (onImageChange) onImageChange(url);
    }
  }, [url]);

  const isValidImageUrl = (url) => {
    return /\.(jpeg|jpg|png|gif|bmp|webp|svg)$/i.test(url);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="flex items-center justify-center w-[400px] h-[400px] border-2 border-dashed border-gray-400 rounded-2xl">
        {imageSrc ? (
          <img
            src={imageSrc}
            width="200"
            alt="Preview"
            className="max-w-full max-h-full object-contain rounded-xl"
            style={{borderRadius: "50vh"}}
          />
        ) : (
          <p className="text-gray-500">Introduce una URL de imagen válida</p>
        )}
      </div>

      <input
        type="text"
        placeholder="Introduce la URL de la imagen..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="mb-4 w-80 p-2 border rounded-xl shadow"
        style={{borderRadius: "50vh"}}
      />
    </div>
  );
}