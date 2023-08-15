import { Close } from "@mui/icons-material";
import { Box, Button, Dialog, Grid } from "@mui/material";
import { useSwipeable } from "react-swipeable";

export const CardOnepieceModal = ({ open, onClose, selectedCard, onSwipeLeft, onSwipeRight }) => {
  const swipeHandlers = useSwipeable({
    onSwipedLeft: onSwipeLeft,
    onSwipedRight: onSwipeRight,
  });

  return (
    <Dialog open={open} onClose={onClose}
      PaperProps={{
        sx: {
          backgroundColor: '#121212',
        },
      }}>
      <Box minWidth={0} minHeight={600} overflowY={"auto"} p={3} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }} {...swipeHandlers}>
        <Box sx={{ position: "absolute", marginTop: "25%", left: 0, top: 0, opacity: "75%", display: { xs: "none", sm: "block" } }}><img style={{ transform: "Rotate(90deg)", width: "auto", height: "100px" }} alt="uniondeck" src="/icons/uniondecklogosmall.png" /></Box>
        <Box textAlign={"center"}><img loading="lazy" src={selectedCard.images}
          draggable="false" alt="test" style={{ width: "250px", height: "351.54375px", borderRadius: "5%", border: "2px solid black" }}
        />
        </Box>
        <Box >
          <Grid draggable="false">
            <Grid container rowSpacing={1} columnSpacing={1}>
              <Grid item xs={3}>
                <Box sx={{ backgroundColor: "#240056", color: "#f2f3f8", padding: 1 }}>Name:</Box>
              </Grid>
              <Grid item xs={9}>
                <Box sx={{ backgroundColor: "#C8A2C8", color: "#000000", padding: 1 }}>{selectedCard.cardname}</Box>
              </Grid>
              <Grid item xs={3}>
                <Box sx={{ backgroundColor: "#240056", color: "#f2f3f8", padding: 1 }}>ID:</Box>
              </Grid>
              <Grid item xs={9}>
                <Box sx={{ backgroundColor: "#C8A2C8", color: "#000000", padding: 1 }}>{selectedCard.cardid}</Box>
              </Grid>
              <Grid item xs={3}>
                <Box sx={{ backgroundColor: "#240056", color: "#f2f3f8", padding: 1 }}>Attribute:</Box>
              </Grid>
              <Grid item xs={9}>
                <Box sx={{ backgroundColor: "#C8A2C8", color: "#000000", padding: 1 }}>{selectedCard.attribute}</Box>
              </Grid>
              <Grid item xs={3}>
                <Box sx={{ backgroundColor: "#240056", color: "#f2f3f8", padding: 1 }}>Type:</Box>
              </Grid>
              <Grid item xs={9}>
                <Box sx={{ backgroundColor: "#C8A2C8", color: "#000000", padding: 1 }}>{selectedCard.typing}</Box>
              </Grid>
              <Grid item xs={3}>
                <Box sx={{ backgroundColor: "#240056", color: "#f2f3f8", padding: 1 }}>Effect:</Box>
              </Grid>
              <Grid item xs={9}>
                <Box sx={{ backgroundColor: "#C8A2C8", color: "#000000", padding: 1 }}>{selectedCard.effect}</Box>
              </Grid>
              <Grid item xs={12}>
                <Button onClick={onClose}
                  sx={{
                    width: "100%", backgroundColor: "#FF6961", color: "#f2f3f8",
                    '&:hover': { color: "#FF6961" },
                  }}>
                  <Close />
                </Button>
                <br></br>
                <br></br>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Dialog>
  );
};