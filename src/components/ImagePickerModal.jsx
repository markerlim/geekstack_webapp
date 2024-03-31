import React from "react";
import { Dialog, DialogTitle, DialogContent, Grid } from "@mui/material";

const ImagePickerModal = ({ open, handleClose, images, handleSaveClick }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Select an image</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{overflowY:'auto'}}>
          {images.map((image, index) => (
            <Grid item xs={3} key={index}>
              <img
                src={image}
                alt="deck"
                style={{ width: "100%", cursor: "pointer" }}
                onClick={() => {
                  handleSaveClick(true,image);
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
