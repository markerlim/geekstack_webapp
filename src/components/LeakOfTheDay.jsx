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
        src: '/UD/JJK-2-004.webp', photoURL: '/UD/JJK-2-004.webp', name: 'Admin',
        content: 'New Card Leak', effect: '[Your Turn] [When In Front Line] If there is a <Getou Suguru> on the same line, this character gains [Damage 2].\n[On Retire] Look at the top 3 card of your deck. Reveal up to 1 <Gojo Satoru>, <Ieiri Shoko> or <Getou Suguru> card among them and add it to your hand. Place the remaining at the bottom of your deck in any order. If you added a card, place 1 card from your hand to the Outside Area.'
    }, {
        src: '/UD/JJK-2-003.webp', photoURL: '/UD/JJK-2-003.webp', name: 'Admin',
        content: 'New Card Leak', effect: '[Your Turn] [When In Front Line] If there is a <Gojo Satoru> on the same line, this character and all <Gojo Satoru> on your Front Line gets +500 BP.\n[Activate Main] [Place 1 card from hand to Outside Area] [Once Per Turn] This character gains [This character also generates energy on the Front Line] during this turn. '
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
                    <Box sx={{ backgroundColor: '#26262d', height: '270px', display: 'flex !important', justifyContent: 'center', alignItems: 'center' }}>
                        <Box key={index} sx={{
                            paddingTop: '0px', flex: '0 0 auto',
                            width: '200px',
                            height: data.src ? '230px' : '120px',
                            backgroundColor: '#f2f3f8',
                            borderRadius: '10px',
                            position: 'relative',
                            border: 'none',
                            overflow: 'hidden',
                        }}
                            onClick={() => handleDrawerOpen(data)}>
                            <Box sx={{ width: 'inherit', height: data.src ? '140px' : '0px', display: 'flex', justifyContent: 'center', alignItems: 'start', backgroundColor: '#26262d', overflow: 'hidden', }}>
                                {data.src && <img src={data.src} alt='name' style={{ width: '200px', height: 'calc(200px * 1.395)', marginTop: '-45px' }} />}
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'row', position: 'absolute', left: '0px', top: data.src ? '120px' : '0px', }}>
                                <Box sx={{ borderRadius: '30px', border: '3px solid #f2f3f8', width: '40px', height: '40px', overflow: 'hidden' }}>
                                    <img src={data.photoURL} alt={data.photoURL} style={{ width: '40px', height: 'auto' }} />
                                </Box>
                                <Box sx={{ fontSize: '14px', color: '#121212', fontWeight: '900', marginTop: data.src ? '22px' : '10px', }}>{data.name}</Box>
                            </Box>
                            <Box sx={{
                                display: 'flex', flexDirection: 'column', gap: '7px', width: '160px',
                                color: '#121212', height: data.src ? '70px' : '100px', fontSize: '10px', paddingLeft: '10px', paddingRight: '5px', justifyContent: 'start', flex: 'none'
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
                <Box sx={{ width: 'calc(95vw - 60px)', height: 'calc(100vh - 60px)', padding: '30px', backgroundColor: '#26252d',overflowY:'auto' }}>
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
                                borderRadius:'5px'
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
                    <Box sx={{ position: 'absolute', bottom: '0%',right:'0%', display: 'flex', alignItems: 'center' }}>
                        <IconButton onClick={handlePrevImage} sx={{ color: 'white' }}>
                            <ChevronLeft />
                        </IconButton>
                        <IconButton onClick={handleNextImage} sx={{ color: 'white' }}>
                            <ChevronRight />
                        </IconButton>
                    </Box>
                </Box>
            </SwipeableDrawer>
        </Box>
    )
}

export default LeakOfTheDay;