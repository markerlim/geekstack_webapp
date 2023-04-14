import React, { useEffect, useState } from "react";

const ResponsiveImage = ({ src, alt, ...props }) => {
  const getImageStyle = () => {
    const screenWidth = window.innerWidth;

    if (screenWidth >= 1000) {
      return { width: "150px", height: "210.92625px" };
    } else {
      return { width: "100px", height: "140.6175px" }; // Default for smaller screens
    }
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

export {ResponsiveImage}
