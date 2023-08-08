import React, { useEffect, useState } from "react";

const ExportWrapper = ({ children }) => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      const container = document.getElementById("export-wrapper");
      if (container) {
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        const scaleX = 1920 / containerWidth;
        const scaleY = 1080 / containerHeight;
        setScale(Math.max(scaleX, scaleY));
      }
    };

    updateScale();
    window.addEventListener("resize", updateScale);

    return () => {
      window.removeEventListener("resize", updateScale);
    };
  }, []);

  return (
    <div
      id="export-wrapper"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        zIndex:-1000
      }}
    >
      {children}
    </div>
  );
};

export default ExportWrapper;
