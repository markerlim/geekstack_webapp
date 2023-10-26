import { Close, } from "@mui/icons-material";
import { Box, Button, Drawer} from "@mui/material";
import { useEffect, useState } from "react";


export const DrawerElement = ({ open, onClose,content }) => {
  const [slidePosition, setSlidePosition] = useState("");

  useEffect(() => {
    if (open) {
      setSlidePosition("0");
    } else {
      setSlidePosition("");
    }
  }, [open]);

  const handleClose = () => {
    setSlidePosition("");
    setTimeout(() => {
      onClose();
    }, 50);
  };

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundColor: '#121212',
          borderRadius: { xs: '20px 20px 0px 0px', sm: '20px 20px 0px 0px', md: '20px 20px 20px 20px' },
          width: { xs: '100%', sm: '100%', md: '700px' },
          height: 'fit-content',
          maxHeight: '90vh',
          position: { md: 'absolute' },
          top: { md: '50%' },
          left: { md: '50%' },
          bottom: { xs: slidePosition, sm: slidePosition },
          transition: "bottom 300ms ease-in-out",
          transform: { md: 'translate(-50%, -50%)' },
        },
      }}
    >
      <Box display="flex" flexDirection="column" minHeight="100%" minWidth={0} overflowY={"auto"} p={3}>
        <Box flexGrow={1} display='flex' flexDirection='column' >
          <Box textAlign={"center"} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
            {content}
          </Box>
        </Box>
        <Box mt={2} display="flex" justifyContent="center" paddingBottom='10px'>
          <Button onClick={() => handleClose()}
            sx={{
              width: "80%", backgroundColor: "#FF6961", color: "#f2f3f8",
              '&:hover': { color: "#FF6961" },
            }}>
            <Close />
          </Button>
        </Box>
      </Box>
    </Drawer >
  );
};