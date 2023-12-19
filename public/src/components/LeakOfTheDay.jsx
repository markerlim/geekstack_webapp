import { ChevronLeft, ChevronRight, MoreHoriz } from "@mui/icons-material";
import { Box, IconButton, SwipeableDrawer } from "@mui/material";
import React, { useState } from "react";
import Slider from "react-slick";

function CustomDot({ onClick, active }) {
    return (
        <Box
            component={'span'}
            sx={{
                display: 'inline-block',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: active ? '#7c4fff' : '#26262d',
                margin: '5px',
                cursor: 'pointer'
            }}
            onClick={onClick}
        />
    );
}

const LeakOfTheDay = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerImageData, setDrawerImageData] = useState(null);
    const [drawerEffectData, setDrawerEffectData] = useState("");

    const handleDrawerOpen = (data) => {
        setDrawerOpen(true);
        setDrawerImageData(data.src);
        setDrawerEffectData(data.effect);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
    };

    const handleSwipe = (event, delta) => {
        if (delta === -1) {
            handleDrawerClose();
        }
    };

    const handleNextImage = () => {
        // Calculate the index of the next slide
        const nextSlideIndex = (currentSlide + 1) % dataset.length;

        // Update the currentSlide state
        setCurrentSlide(nextSlideIndex);

        // Set the image data for the next slide in the drawer
        setDrawerImageData(dataset[nextSlideIndex].src);
        setDrawerEffectData(dataset[nextSlideIndex].effect);
    };

    const handlePrevImage = () => {
        // Calculate the index of the previous slide
        const prevSlideIndex = (currentSlide - 1 + dataset.length) % dataset.length;

        // Update the currentSlide state
        setCurrentSlide(prevSlideIndex);

        // Set the image data for the previous slide in the drawer
        setDrawerImageData(dataset[prevSlideIndex].src);
        setDrawerEffectData(dataset[prevSlideIndex].effect);
    };

    const dataset = [{
        src: 'https://firebasestorage.googleapis.com/v0/b/geek-stack.appspot.com/o/cardleaks%2FDST-1-107-LEAK.png?alt=media&token=f7756c84-7bb5-460d-9596-1a850dc5abf0', photoURL: '/UD/JJK-2-004.webp', name: 'Admin',
        content: 'New Card Leak', effect: '[Raid] <Ishigami Senku> (active this character, you may move it to the frontline).\n[On Play] Choose up to 1 character on your area with a face-down card under it, add the face-down card under that character to your hand and place 1 card from your hand to the Outside Area. Set the chosen character to active.\n[On Retire] You may place 1 <Revival Fluid> from your hand to the Outside Area. If you did, play this character to your area rested or add it to your hand.'
    }, {
        src: 'https://firebasestorage.googleapis.com/v0/b/geek-stack.appspot.com/o/cardleaks%2FDST-1-105-LEAK.png?alt=media&token=1249feb3-4af3-425c-9140-4af43b7e93fc', photoURL: '/UD/JJK-2-003.webp', name: 'Admin',
        content: 'New Card Leak', effect: 'If there is face-down card under this character, it may not active.\n[Impact 1] (When attacks and wins the battle, it deals 1 damage to your opponent)\n[Your Turn] This character gets +1000 BP.\n[On Play] Place the top card of your deck under this character face-down.'
    }]
    const settings = {
        customPaging: function (i) {
            return <CustomDot key={i} active={i === currentSlide} onClick={() => setCurrentSlide(i)} />;
        },
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        afterChange: (index) => {
            setCurrentSlide(index);
        },
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
        <Box sx={{ width: '100vw', height: '240px' }}>
            <Slider {...settings}>
                {dataset.map((data, index) => (
                    <Box sx={{ backgroundColor: '#26262d', height: '250px', display: 'flex !important', justifyContent: 'center', alignItems: 'center' }}>
                        <Box key={index} sx={{
                            paddingTop: '0px', flex: '0 0 auto',
                            width: '200px',
                            height: '200px',
                            backgroundColor: '#121212',
                            borderRadius: '10px',
                            position: 'relative',
                            border: '3px solid #7C4FFF',
                            overflow: 'hidden',
                        }}
                            onClick={() => handleDrawerOpen(data)}>
                            <Box sx={{ width: 'inherit', height: data.src ? '140px' : '0px', display: 'flex', justifyContent: 'center', alignItems: 'start', backgroundColor: '#26262d', overflow: 'hidden', }}>
                                {data.src && <img src={data.src} alt='name' style={{ width: '200px', height: 'calc(200px * 1.395)', marginTop: '-45px' }} />}
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'row', position: 'absolute', left: '5px',gap:'5px', top: '120px' }}>
                                <Box sx={{ borderRadius: '30px', border: '3px solid #121212', width: '40px', height: '40px', overflow: 'hidden' }}>
                                    <img src={data.photoURL} alt={data.photoURL} style={{ width: '40px', height: 'auto' }} />
                                </Box>
                                <Box sx={{ fontSize: '14px', color: '#f2f8fc', fontWeight: '900', marginTop: data.src ? '22px' : '10px', }}>{data.name}</Box>
                            </Box>
                            <Box sx={{
                                display: 'flex', flexDirection: 'column', gap: '7px', width: '160px',
                                color: '#f2f8fc', fontSize: '10px', paddingLeft: '10px', paddingRight: '5px', justifyContent: 'start', flex: 'none'
                            }}>
                                <Box sx={{ height: data.src ? '16px' : '40px', }}></Box>
                                {data.content.split('\n').map((line, i) => (
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
                    </Box>
                ))}
            </Slider>
            <SwipeableDrawer anchor="right" open={drawerOpen} onClose={handleDrawerClose} onSwipeRight={handleDrawerClose} onSwipeableClose={handleDrawerClose} onSwiped={handleSwipe}>
                <Box sx={{ width: 'calc(95vw - 60px)', height: 'calc(100vh - 60px)', padding: '30px', backgroundColor: '#26252d', overflowY: 'auto' }}>
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
                    <Box sx={{ width: '100%', display: 'flex', justifyContent:'right',alignItems: 'center' }}>
                        <Box onClick={handlePrevImage} sx={{ color: 'white', backgroundColor: '#240056', borderRadius: '0px', padding: '10px' }}>
                            <ChevronLeft />
                        </Box>
                        <Box onClick={handleNextImage} sx={{ color: 'white', backgroundColor: '#240056', borderRadius: '0px', padding: '10px' }}>
                            <ChevronRight />
                        </Box>
                    </Box>
                </Box>
            </SwipeableDrawer>
        </Box>
    )
}

export default LeakOfTheDay;