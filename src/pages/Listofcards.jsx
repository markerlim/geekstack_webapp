
import BottomNav from "../components/BottomNav"
import { Box, Button, ButtonBase } from "@mui/material"

import NavbarHome from "../components/NavbarHome";
import { Link } from "react-router-dom";

const Listofcards = () => {
    return (
        <div>
            <Box color={"#f2f3f8"}>
                <NavbarHome />
                <Box>
                    <Box sx={{ paddingLeft: "15px", paddingRight: "15px", display: "flex", flexDirection: "column", alignItems: "center", }} overflowY={"auto"} height={"100vh"}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', flex: '0 0 auto', flexWrap: 'nowrap', gap: '25px', justifyContent: 'center', alignItems: 'center', width: '100vw', paddingTop: '30px' }}>
                            <Button
                                sx={{
                                    width:{xs:'90vw', sm:'auto'}, height:'auto',flex: '0 0 auto', padding: 0, borderRadius: "10px", overflow: 'hidden', transition: 'all 0.2s ease-in-out',
                                }}
                                component={Link}
                                to="/unionarena"
                            >
                                <img style={{ width: "100%" }} alt="unionarena" src="/images/uatcgbutton.webp" />
                            </Button>
                            <Button
                                sx={{
                                    width:{xs:'90vw', sm:'auto'}, height:'auto',flex: '0 0 auto', padding: 0, borderRadius: "10px", overflow: 'hidden', transition: 'all 0.2s ease-in-out',
                                }}
                                component={Link}
                                to="/onepiece"
                            >
                                <img style={{ width: "100%" }} alt="onepiece" src="/images/optcgbutton.webp" />
                            </Button>
                        </Box>
                    </Box>
                    <Box sx={{ display: { xs: "block", sm: "block", md: "none" } }}><BottomNav /></Box>
                </Box>
            </Box>
        </div>
    );
}

export default Listofcards