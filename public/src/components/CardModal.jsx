import { Box, Button, Dialog, DialogActions, List, ListItem, ListItemText } from "@mui/material";

export const CardModal = ({ open, onClose, selectedCard }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <Box width={500} height={600} bgcolor="primary" p={3} borderRadius={5} sx={{display:'flex',flexDirection:'column',gap:3}}>
        <Box><img loading="lazy" src={selectedCard.image}  
        draggable="false" alt="test" style={{width: "200px", height: "281.235px", borderRadius: "5%", border: "2px solid black"}}
        />
        </Box>
        <Box>
          <List>
            <ListItem disablePadding>
              <ListItemText primary="Cardname:" secondary={selectedCard.cardName}  style={{display:'flex',flexDirection:"row",gap:3,alignItems:'center'}}/>
            </ListItem>
            <ListItem disablePadding>
              <ListItemText primary="Card No.:" secondary={selectedCard.cardId}  style={{display:'flex',flexDirection:"row",gap:3,alignItems:'center'}}/>
            </ListItem>
            <ListItem disablePadding>
              <ListItemText primary="Color:" secondary={selectedCard.color}  style={{display:'flex',flexDirection:"row",gap:3,alignItems:'center'}}/>
            </ListItem>
            <ListItem disablePadding>
              <ListItemText primary="Effect:" secondary={selectedCard.effect}  style={{display:'flex',flexDirection:"row",gap:3,alignItems:'center'}}/>
            </ListItem>
            <ListItem disablePadding>
              <ListItemText primary="Trigger:" secondary={selectedCard.trigger}  style={{display:'flex',flexDirection:"row",gap:3,alignItems:'center'}}/>
            </ListItem>     
          </List>
        </Box>
      </Box>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
