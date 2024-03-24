import { Close, Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, Button, Drawer, Grid, Modal, } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";


export const OPTCGCardDrawer = ({ open, onClose, selectedCard, onSwipeLeft, onSwipeRight }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showFullSize, setShowFullSize] = useState(false);
  const [slidePosition, setSlidePosition] = useState("-100vh");

  function replaceTagsWithIcons(line) {
    let replacedLine = line;

    Object.keys(tagsToIcons).forEach((tag, index) => {
      const placeholder = `##REPLACE${index}##`;
      replacedLine = replacedLine.split(tag).join(placeholder);
    });

    const lineSegments = replacedLine.split(/(##REPLACE\d+##|\(.*?\))/);

    return lineSegments.map((segment, index) => {
      const tagIndexMatch = segment.match(/##REPLACE(\d+)##/);

      if (tagIndexMatch) {
        const tagIndex = parseInt(tagIndexMatch[1], 10);
        const tag = Object.keys(tagsToIcons)[tagIndex];
        return (
          <img
            key={index}
            src={tagsToIcons[tag]}
            alt={tag}
            style={{ height: '14px', verticalAlign: 'middle' }}
          />
        );
      }

      if (segment.startsWith('(') && segment.endsWith(')') && !tagsToIcons[segment]) {
        return <span key={index} style={{ fontSize: '11px', verticalAlign: 'middle' }}>{segment}</span>;
      }

      return segment;
    });
  }

  useEffect(() => {
    if (open) {
      setSlidePosition("0");
    } else {
      setSlidePosition("-100vh");
    }
  }, [open]);

  const handleClose = () => {
    setSlidePosition("-100vh");
    setTimeout(() => {
      onClose();
    }, 50);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: onSwipeLeft,
    onSwipedRight: onSwipeRight,
  });

  const tagsToIcons = {
    "[Impact 1]": "/icons/UAtags/CTImpact1.png",
    "[Impact 2]": "/icons/UAtags/CTImpact2.png",
    "[Impact]": "/icons/UAtags/CTImpact.png",
    "[Block x2]": "/icons/UAtags/CTBlkx2.png",
    "[Attack x2]": "/icons/UAtags/CTAtkx2.png",
    "[Snipe]": "/icons/UAtags/CTSnipe.png",
    "[Impact +1]": "/icons/UAtags/CTImpact+1.png",
    "[Step]": "/icons/UAtags/CTStep.png",
    "[Damage]": "/icons/UAtags/CTDmg.png",
    "[Damage +1]": "/icons/UAtags/CTDmg+1.png",
    "[Damage 2]": "/icons/UAtags/CTDmg2.png",
    "[Damage 3]": "/icons/UAtags/CTDmg3.png",
    "[Impact Negate]": "/icons/UAtags/CTImpactNegate.png",
    "[Once Per Turn]": "/icons/UAtags/CTOncePerTurn.png",
    "[Rest this card]": "/icons/UAtags/CTRestThisCard.png",
    "[Retire this card]": "/icons/UAtags/CTRetirethiscard.png",
    "[Place 1 card from hand to Outside Area]": "/icons/UAtags/CT1HandtoOA.png",
    "[Place 2 card from hand to Outside Area]": "/icons/UAtags/CT2HandtoOA.png",
    "[When In Front Line]": "/icons/UAtags/CTWhenInFrontLine.png",
    "[When In Energy Line]": "/icons/UAtags/CTWhenInEnergyLine.png",
    "[Pay 1 AP]": "/icons/UAtags/CTPay1AP.png",
    "[Raid]": "/icons/UAtags/CTRaid.png",
    "[On Play]": "/icons/UAtags/CTOnPlay.png",
    "[On Retire]": "/icons/UAtags/CTOnRetire.png",
    "[On Block]": "/icons/UAtags/CTOnBlock.png",
    "[When Blocking]": "/icons/UAtags/CTWhenBlocking.png",
    "[Activate Main]": "/icons/UAtags/CTActivateMain.png",
    "[When Attacking]": "/icons/UAtags/CTWhenAttacking.png",
    "[Your Turn]": "/icons/UAtags/CTYourTurn.png",
    "[Opponent's Turn]": "/icons/UAtags/CTOppTurn.png",
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
      {...swipeHandlers}
    >
      <Box display="flex" flexDirection="column" minHeight="100%" minWidth={0} overflowY={"auto"} p={3}>
        <Box flexGrow={1} display='flex' flexDirection='column' >
          <Box textAlign={"center"} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
            <Box
              component={'img'}
              loading="lazy"
              src={selectedCard.image}
              draggable="false"
              alt="test"
              sx={{ width: { xs: "100px", sm: "150px", md: "250px" }, height: { xs: "140.6175px", sm: "210.92625px", md: "351.54375px" }, borderRadius: "5%", border: "2px solid black", cursor: "pointer" }}
              onClick={() => setShowFullSize(true)}
            />
            {/* Modal for Full Size Image */}
            <Modal
              open={showFullSize}
              onClose={() => setShowFullSize(false)}
              aria-labelledby="full-size-image"
              aria-describedby="click-to-close"
            >
              <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                boxShadow: 24,
              }}>
                <Box
                  component='img'
                  src={selectedCard.image}
                  alt="Full Size"
                  sx={{ width: { xs: '80vw', sm: '400px' }, cursor: "pointer" }}
                  onClick={() => setShowFullSize(false)}
                />
              </Box>
            </Modal>
            <span style={{ color: "#f2f3f8" }}>tap card to see full</span>
            <Box
              sx={{
                backgroundColor: '#c8a2c8',
                margin: '5px',
                padding: '10px',
                borderRadius: '20px',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease-in-out',
              }}
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? <Visibility /> : <VisibilityOff />}
            </Box>
          </Box>
          <Box >
            <Grid draggable="false">
              <Grid container rowSpacing={1} columnSpacing={1}>
                <Grid item xs={3}>
                  <Box sx={{ backgroundColor: "#240056", color: "#f2f3f8", padding: 1 }}>Id:</Box>
                </Grid>
                <Grid item xs={9}>
                    <Box sx={{ backgroundColor: "#C8A2C8", color: "#000000", padding: 1 }}>{selectedCard.cardId}</Box>
                  </Grid>
                {showDetails && (<>
                  <Grid item xs={3}>
                    <Box sx={{ backgroundColor: "#240056", color: "#f2f3f8", padding: 1 }}>Name:</Box>
                  </Grid>
                  <Grid item xs={9}>
                    <Box sx={{ backgroundColor: "#C8A2C8", color: "#000000", padding: 1 }}>{selectedCard.cardname}</Box>
                  </Grid>
                  <Grid item xs={3}>
                    <Box sx={{ backgroundColor: "#240056", color: "#f2f3f8", padding: 1 }}>Attribute:</Box>
                  </Grid>
                  <Grid item xs={9}>
                    <Box sx={{ backgroundColor: "#C8A2C8", color: "#000000", padding: 1 }}>{selectedCard.attribute}</Box>
                  </Grid>
                  <Grid item xs={3}>
                    <Box sx={{ backgroundColor: "#240056", color: "#f2f3f8", padding: 1 }}>Power:</Box>
                  </Grid>
                  <Grid item xs={9}>
                    <Box sx={{ backgroundColor: "#C8A2C8", color: "#000000", padding: 1 }}>{selectedCard.power}</Box>
                  </Grid>
                  <Grid item xs={3}>
                    <Box sx={{ backgroundColor: "#240056", color: "#f2f3f8", padding: 1 }}>Counter:</Box>
                  </Grid>
                  <Grid item xs={9}>
                    <Box sx={{ backgroundColor: "#C8A2C8", color: "#000000", padding: 1 }}>{selectedCard.counter}</Box>
                  </Grid>
                  <Grid item xs={3}>
                    <Box sx={{ backgroundColor: "#240056", color: "#f2f3f8", padding: 1 }}>Cost/Life:</Box>
                  </Grid>
                  <Grid item xs={9}>
                    <Box sx={{ backgroundColor: "#C8A2C8", color: "#000000", padding: 1 }}>{selectedCard.cost_life}</Box>
                  </Grid>
                </>)}
                <Grid item xs={3}>
                  <Box sx={{ backgroundColor: "#240056", color: "#f2f3f8", padding: 1 }}>Traits:</Box>
                </Grid>
                <Grid item xs={9}>
                  <Box sx={{ backgroundColor: "#C8A2C8", color: "#000000", padding: 1 }}>{selectedCard.typing}</Box>
                </Grid>
                <Grid item xs={3}>
                  <Box sx={{ backgroundColor: "#240056", color: "#f2f3f8", padding: 1 }}>Effect:</Box>
                </Grid>
                <Grid item xs={9}>
                  <Box
                    sx={{
                      backgroundColor: "#C8A2C8",
                      color: "#000000",
                      padding: 1,
                      fontSize: '14px',
                    }}
                  >
                    {selectedCard.effects.split('\\n').map((line, index) => (
                      <React.Fragment key={index}>
                        {replaceTagsWithIcons(line)}
                        <br />
                      </React.Fragment>
                    ))}
                  </Box>
                </Grid>
                <Grid item xs={3}>
                  <Box sx={{ backgroundColor: "#240056", color: "#f2f3f8", padding: 1 }}>Trigger:</Box>
                </Grid>
                <Grid item xs={9}>
                  <Box sx={{ backgroundColor: "#C8A2C8", color: "#000000", padding: 1 }}>{selectedCard.trigger}</Box>
                </Grid>
              </Grid>
            </Grid>
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