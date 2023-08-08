import React, { useEffect, useState } from "react";

const ResponsiveImage = ({ src, alt, ...props }) => {
  const getImageStyle = () => {
    const screenWidth = window.innerWidth;

    if (screenWidth >= 1200) {
      return { width: "150px", height: "210.925px" };
    } else if (screenWidth >= 900) {
      return { width: "100px", height: "140.61875px" }
    } else if (screenWidth >= 600) {
      return { width: "100px", height: "140.61875px" }
    }
    else {
      return { width: "75px", height: "105.463125px" }; // Default for smaller screens
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

export { ResponsiveImage }
