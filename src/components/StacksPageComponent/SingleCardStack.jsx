import { Box, SwipeableDrawer } from "@mui/material";
import React, { useState } from "react";
import { MoreHoriz, Pentagon } from "@mui/icons-material";
import { ResponsiveImage } from "./../ResponsiveImage";

const SingleCardStack = (grpdata, index) => {
    const data = grpdata.data;
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerImageData, setDrawerImageData] = useState(null);
    const [drawerEffectData, setDrawerEffectData] = useState("");

    const handleDrawerOpen = (data) => {
        setDrawerOpen(true);
        setDrawerImageData(data.selectedCards[0].imagesrc);
        setDrawerEffectData(data.effect);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
    };

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

    const tagsToIcons = {
        "[Impact 1]": "/icons/UAtags/CTImpact1.png",
        "[Impact]": "/icons/UAtags/CTImpact.png",
        "[Block x2]": "/icons/UAtags/CTBlkx2.png",
        "[Attack x2]": "/icons/UAtags/CTAtkx2.png",
        "[Snipe]": "/icons/UAtags/CTSnipe.png",
        "[Impact +1]": "/icons/UAtags/CTImpact+1.png",
        "[Step]": "/icons/UAtags/CTStep.png",
        "[Damage]": "/icons/UAtags/CTDmg.png",
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
        "[Activate Main]": "/icons/UAtags/CTActivateMain.png",
        "[When Attacking]": "/icons/UAtags/CTWhenAttacking.png",
        "[Your Turn]": "/icons/UAtags/CTYourTurn.png",
        "[Opponent's Turn]": "/icons/UAtags/CTOppTurn.png",
    };

    return (
        <>
            <Box key={index} sx={{
                paddingTop: '0px',
                height: !data.description ? '190px' : (data.selectedCards[0].imagesrc ? '230px' : '120px'),
                width: '100%', // Adjust width to fill the column
                backgroundColor: '#26262d',
                borderRadius: '10px',
                position: 'relative',
                border: 'none',
                overflow: 'hidden',
            }}
                onClick={() => handleDrawerOpen(data)}>
                <Box sx={{ width: 'inherit', height: data.selectedCards[0].imagesrc ? '140px' : '0px', display: 'flex', justifyContent: 'center', alignItems: 'start', backgroundColor: '#26262d', overflow: 'hidden', }}>
                    {data.selectedCards[0].imagesrc && <img src={data.selectedCards[0].imagesrc} alt='name' style={{ width: '200px', height: 'calc(200px * 1.395)', marginTop: '-45px' }} />}
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row',gap:'5px', position: 'absolute', left: '0px', top: data.selectedCards[0].imagesrc ? '120px' : '0px', }}>
                    <Box sx={{ borderRadius: '30px', border: '4px solid #26262d', width: '40px', height: '40px', overflow: 'hidden' }}>
                        <img src={data.photoURL} alt={data.photoURL} style={{ width: '40px', height: 'auto' }} />
                    </Box>
                    <Box sx={{ fontSize: '14px', color: '#f2f8fc', fontWeight: '900', marginTop: data.selectedCards[0].imagesrc ? '22px' : '10px', }}>{data.displayName}</Box>
                </Box>
                <Box sx={{
                    display: 'flex', flexDirection: 'column', gap: '7px', width: '160px',
                    color: '#f2f8fc', height: !data.description ? '30px' : (data.selectedCards[0].imagesrc ? '70px' : '100px'), fontSize: '10px', paddingLeft: '10px', paddingRight: '10px', justifyContent: 'start', flex: 'none'
                }}>
                    <Box sx={{ height: !data.description ? '16px' : (data.selectedCards[0].imagesrc ? '16px' : '40px') }}></Box>
                    {data.description && data.description.split('\n').map((line, i) => (
                        <React.Fragment key={i}>
                            {line}
                            <br />
                        </React.Fragment>
                    ))}
                </Box>
                <Box sx={{ position: "absolute", right: '10px', bottom: '0px', color: '#D3D3D3' }}>
                    <MoreHoriz />
                </Box>
            </Box>
            <SwipeableDrawer anchor="right" open={drawerOpen} onClose={handleDrawerClose} onSwipeRight={handleDrawerClose} onSwipeableClose={handleDrawerClose}>
                <Box sx={{ width: 'calc(95vw - 60px)', height: 'calc(100vh - 60px)', padding: '30px', backgroundColor: '#26252d', overflowY: 'auto' }}>
                <Box sx={{ display: "flex", width: { xs: "100%", sm: "500px", md: "700px" }, justifyContent: "center", backgroundColor: "#26252D" }}>
              <Box sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap", paddingTop: "30px", gap: "10px", }}>
                {data.cards.map((card, index) => (
                  <div style={{ position: "relative" }}>
                    <Box sx={{ position: "absolute", bottom: "15px", left: "50%", transform: "translateX(-50%)", zIndex: "3" }}>
                      <div style={{ fontSize: "20px", color: "#74CFFF" }}><strong>{card.count}</strong></div>
                    </Box>
                    <Box sx={{ position: "absolute", bottom: "5px", left: "50%", transform: "translateX(-50%)", zIndex: "2" }}>
                      <Pentagon sx={{ fontSize: '40px', color: '#11172d' }} />
                    </Box>
                    <ResponsiveImage key={index} src={card.image} alt={card.cardName} />
                  </div>
                ))}
              </Box>
            </Box>
                    {drawerImageData && (
                        <img src={drawerImageData} alt="Drawer Content" style={{ width: '100%', height: 'auto' }} />
                    )}
                    {drawerEffectData && (
                        <Box
                            sx={{
                                backgroundColor: "#C8A2C8",
                                color: "#000000",
                                padding: 1,
                                fontSize: '14px',
                                borderRadius: '5px'
                            }}
                        >
                            {drawerEffectData.split('\n').map((line, index) => (
                                <React.Fragment key={index}>
                                    {replaceTagsWithIcons(line)}
                                    <br />
                                </React.Fragment>
                            ))}
                        </Box>
                    )}
                </Box>
            </SwipeableDrawer>
        </>
    )
}

export default SingleCardStack;