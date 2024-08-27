
import BottomNav from "../components/BottomNav"
import { Box, Button, } from "@mui/material"
import { Link } from "react-router-dom";
import DecklibrarybtnMobile from "../components/DeckLibraryButtonsMobile";
import { LibraryBooks } from "@mui/icons-material";
import OPDecklibrarybtn from "../components/OPTCGPageComponent/OPDeckLibraryButtons";
import { CardStateProviderOnepiece } from "../context/useCardStateOnepiece";
import { CardStateProviderDragonballz } from "../context/useCardStateDragonballz";
import DBZFWDecklibrarybtn from "../components/DBZFWPageComponent/DBZFWDeckLibraryButtons";
import NavbarPrompt from "../components/NavbarPromptLogin";

const Listofcards = () => {
    return (
        <div>
            <Box color={"#f2f3f8"}>
                <NavbarPrompt />
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
                                    <img style={{ width: "100%" }} alt="unionarena" src="/images/homeUAbtn.jpg" />
                                </Button>
                                <Button
                                    sx={{
                                        width: { xs: '30vw', sm: 'auto' }, height: 'auto', flex: '0 0 auto', marginRight: '20px', padding: 0, borderRadius: "10px", overflow: 'hidden', transition: 'all 0.2s ease-in-out',
                                    }}
                                    component={Link}
                                    to="/onepiece"
                                >
                                    <img style={{ width: "100%" }} alt="unionarena" src="/images/homeOPbtn.jpg" />
                                </Button>
                                <Button
                                    sx={{
                                        width: { xs: '30vw', sm: 'auto' }, height: 'auto', flex: '0 0 auto', marginRight: '20px', padding: 0, borderRadius: "10px", overflow: 'hidden', transition: 'all 0.2s ease-in-out',
                                    }}
                                    component={Link}
                                    to="/dragonballzfw"
                                >
                                    <img style={{ width: "100%" }} alt="unionarena" src="/images/homeDBZbtn.jpg" />
                                </Button>
                                <Button
                                    sx={{
                                        width: { xs: '30vw', sm: 'auto' }, height: 'auto', flex: '0 0 auto', marginRight: '20px', padding: 0, borderRadius: "10px", overflow: 'hidden', transition: 'all 0.2s ease-in-out',
                                    }}
                                    component={Link}
                                    to="/pokemon"
                                >
                                    <img style={{ width: "100%" }} alt="unionarena" src="/images/homePKMNbtn.jpg" />
                                </Button>
                                <div style={{ paddingLeft: '5vw' }}>
                                    <br />
                                </div>
                            </Box>
                        </Box>
                        <Box sx={{ height: '0.5px', width: '100vw', backgroundColor: '#3F3754' }}><br /></Box>
                        <Box overflowX={'auto'} sx={{ height: { xs: '400px' } }}>
                            <DecklibrarybtnMobile />
                        </Box>
                        <Box sx={{ height: '0.5px', width: '100vw', backgroundColor: '#3F3754' }}><br /></Box>
                        <Box overflowX={'auto'} sx={{ height: { xs: '400px' } }}>
                            <CardStateProviderOnepiece>
                                <OPDecklibrarybtn />
                            </CardStateProviderOnepiece>
                        </Box>
                        <Box overflowX={'auto'} sx={{ height: { xs: '400px' } }}>
                            <CardStateProviderDragonballz>
                                <DBZFWDecklibrarybtn />
                            </CardStateProviderDragonballz>
                        </Box>
                        <Box sx={{ height: '0.5px', width: '100vw', backgroundColor: '#3F3754' }}><br /></Box>
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