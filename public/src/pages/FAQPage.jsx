
import BottomNav from "../components/BottomNav"
import { Box} from "@mui/material"

import NavbarHome from "../components/NavbarHome";
import { Link } from "react-router-dom";

const FAQPage = () => {
    return (
        <div>
            <Box color={"#f2f3f8"}>
                <NavbarHome />
                <Box>
                    <Box sx={{ paddingLeft: "15px", paddingRight: "15px", paddingTop: '10px', display: "flex", flexDirection: "column", alignItems: "center", gap: '15px', height: "calc(100vh - 144px)" }} overflowY={"auto"}>
                        HELLO WORLD
                    </Box>
                    <Box sx={{ display: { xs: "block", sm: "block", md: "none" } }}><BottomNav /></Box>
                </Box>
            </Box>
        </div>
    );
}

export default FAQPage