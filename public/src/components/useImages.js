import { useState, useEffect } from 'react';

const useImages = (imageUrls, options) => {
  const [loadedImages, setLoadedImages] = useState([]);

  useEffect(() => {
    let images = imageUrls.map((url) => {
      let img = new Image();
      if (options && options.crossOrigin) {
        img.crossOrigin = options.crossOrigin;
      }
      img.src = url;
      return img;
    });

    const handleImageLoad = () => {
      if (images.every((img) => img.complete)) {
        setLoadedImages(images);
      }
    };

    images.forEach((img) => {
      img.addEventListener('load', handleImageLoad);
    });

    return () => {
      images.forEach((img) => {
        img.removeEventListener('load', handleImageLoad);
      });
    };
  }, [imageUrls, options]);

  return [loadedImages];
};

export default useImages;
