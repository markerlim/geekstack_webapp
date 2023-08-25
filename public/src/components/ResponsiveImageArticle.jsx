import React, { useEffect, useState } from "react";

const ResponsiveImageArticle = ({ src, alt, ...props }) => {
  const originalWidth = 250;
  const originalHeight = 349.16;
  
  const getAspectRatio = () => originalHeight / originalWidth;
  
  const getImageStyle = () => {
    const screenWidth = window.innerWidth;
    let width;

    if (screenWidth >= 1200) {
      width = 225;
    } else if (screenWidth >= 900) {
      width = 225;
    } else if (screenWidth >= 600) {
      width = 150;
    } else {
      width = 150; // Default for smaller screens
    }

    return { width: `${width}px`, height: `${width * getAspectRatio()}px` };
  };

  const [imageStyle, setImageStyle] = useState(getImageStyle());

  const handleResize = () => {
    setImageStyle(getImageStyle());
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <img
      src={src}
      alt={alt}
      style={{
        ...imageStyle,
        borderRadius: "5%",
        border: "2px solid black",
        cursor: "pointer",
      }}
      {...props}
    />
  );
};

export { ResponsiveImageArticle }
