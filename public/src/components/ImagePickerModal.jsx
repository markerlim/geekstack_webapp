import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, Grid, Button } from "@mui/material";

const ImagePickerModal = ({ open, handleClose, images, handleSaveClick }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const imagesPerPage = 8; // Number of images to show per page

  // Calculate total pages
  const totalPages = Math.ceil(images.length / imagesPerPage);

  // Get current page's images
  const startIndex = (currentPage - 1) * imagesPerPage;
  const paginatedImages = images.slice(startIndex, startIndex + imagesPerPage);

  // Handle next and previous page
  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Select an image</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ overflowY: "auto" }}>
          {paginatedImages.map((specialImage, index) => (
            <Grid item xs={3} key={index}>
              <img
                src={specialImage}
                alt="deck"
                style={{ width: "100%", cursor: "pointer" }}
                onClick={() => {
                  handleSaveClick(specialImage, true);
                  handleClose();
                }}
              />
            </Grid>
          ))}
        </Grid>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
          <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
            Previous
          </Button>
          <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
            Next
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImagePickerModal;
