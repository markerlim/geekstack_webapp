import { Delete, Functions, ImportExport, Save } from "@mui/icons-material";
import { Button, Fab, Tooltip } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

const ExpandableFunctions = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const expandableRef = useRef();

  const handleButtonClick = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (expandableRef.current && !expandableRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [expandableRef]);

  return (
    <div ref={expandableRef}>
      <Tooltip
        component={Button}
        onClick={handleButtonClick}
        title="Functions"
        sx={{
          position: "fixed",
          bottom: 20,
          right: { xs: "calc(50% - 25px)", md: 30 },
        }}
      >
        <Fab color="primary" aria-label="add">
          <Functions />
        </Fab>
      </Tooltip>
      {isExpanded && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 15,
            position: "fixed",
            bottom: 90, 
          }}
        >
          <Tooltip
            component={Button}
            title="Import/Export"
            sx={{ position: "relative" }}
          >
            <Fab color="primary" aria-label="add">
              <ImportExport />
            </Fab>
          </Tooltip>
          <Tooltip
            component={Button}
            title="Delete Deck"
            sx={{ position: "relative" }}
          >
            <Fab color="primary" aria-label="add">
              <Delete />
            </Fab>
          </Tooltip>
          <Tooltip
            component={Button}
            title="Save Deck"
            sx={{ position: "relative" }}
          >
            <Fab color="primary" aria-label="add">
              <Save />
            </Fab>
          </Tooltip>
        </div>
      )}
    </div>
  );
};

export default ExpandableFunctions;
