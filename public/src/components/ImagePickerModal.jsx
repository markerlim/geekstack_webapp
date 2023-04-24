import React from "react";
import { Dialog, DialogTitle, DialogContent, Grid } from "@mui/material";

const ImagePickerModal = ({ open, handleClose, images, handleImageSelected }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Select an image</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {images.map((image, index) => (
            <Grid item xs={3} key={index}>
              <img
                src={image}
                alt={`Image ${index}`}
                style={{ width: "100%", cursor: "pointer" }}
                onClick={() => {
                  handleImageSelected(image);
                  handleClose();
                }}
              />
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ImagePickerModal;
