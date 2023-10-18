
import BottomNav from "../components/BottomNav"
import { Box, Button, } from "@mui/material"

import NavbarHome from "../components/NavbarHome";
import { Link } from "react-router-dom";
import Decklibrarybtn from "../components/DeckLibraryButtons";
import { LibraryBooks } from "@mui/icons-material";
import OPDecklibrarybtn from "../components/OPTCGPageComponent/OPDeckLibraryButtons";
import { CardStateProviderOnepiece } from "../context/useCardStateOnepiece";

const Listofcards = () => {
    return (
        <div>
            <Box color={"#f2f3f8"}>
                <NavbarHome />
                <Box>
                    <Box sx={{ paddingLeft: "15px", paddingRight: "15px", display: "flex", flexDirection: "column", gap: '15px', alignItems: "center", paddingTop: '20px', height: "calc(100vh - 144px)" }} overflowY={"auto"}>
                        <Box sx={{ display: 'flex', flexDirection: "column", gap: '15px', justifyContent: 'left' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', paddingLeft: 'calc(5vw)', paddingRight: 'calc(5vw)' }}>
                                <span style={{ display: 'flex', alignItems: 'center' }}><LibraryBooks style={{ marginRight: '10px' }} />Libraries</span>
                                <Link to="/test" style={{ display: 'none' }}>view all</Link>
                            </Box>
                            <Box sx={{ width: '100vw', display: "flex", flexWrap: "nowrap", overflow: "auto", height: 'auto', }} className="hide-scrollbar">
                                <div style={{ paddingLeft: '5vw' }}>
                                    <br />
                                </div>
                                <Button
                                    sx={{
                                        width: { xs: '30vw', sm: 'auto' }, height: 'auto', flex: '0 0 auto', marginRight: '20px', padding: 0, borderRadius: "10px", overflow: 'hidden', transition: 'all 0.2s ease-in-out',
                                    }}
                                    component={Link}
                                    to="/unionarena"
                                >
                                    <img style={{ width: "100%" }} alt="unionarena" src="/images/UALibrary.webp" />
                                </Button>
                                <Button
                                    sx={{
                                        width: { xs: '30vw', sm: 'auto' }, height: 'auto', flex: '0 0 auto', marginRight: '20px', padding: 0, borderRadius: "10px", overflow: 'hidden', transition: 'all 0.2s ease-in-out',
                                    }}
                                    component={Link}
                                    to="/onepiece"
                                >
                                    <img style={{ width: "100%" }} alt="unionarena" src="/images/OPLibrary.webp" />
                                </Button>
                                <div style={{ paddingLeft: '5vw' }}>
                                    <br />
                                </div>
                            </Box>
                        </Box>
                        <Box sx={{ height: '0.5px', width: '100vw', backgroundColor: '#3F3754' }}><br /></Box>
                        <Box overflowX={'auto'}>
                            <Decklibrarybtn />
                        </Box>
                        <Box sx={{ height: '0.5px', width: '100vw', backgroundColor: '#3F3754' }}><br /></Box>
                        <Box overflowX={'auto'}>
                            <CardStateProviderOnepiece>
                                <OPDecklibrarybtn />
                            </CardStateProviderOnepiece>
                        </Box>
                        <div style={{ height: '1px', padding: '20px' }}>
                            <br />
                        </div>
                    </Box>
                    <Box sx={{ display: { xs: "block", sm: "block", md: "none" } }}><BottomNav /></Box>
                </Box>
            </Box>
        </div>
    );
}

export default Listofcards