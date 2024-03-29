
import BottomNav from "../components/BottomNav"
import { Box } from "@mui/material"

import NavbarHome from "../components/NavbarHome";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";

const Listofnews = () => {
    const [imageData, setImageData] = useState([]);
    const imagedataurl = "https://ap-southeast-1.aws.data.mongodb-api.com/app/data-fwguo/endpoint/getLatestRelease"
    useEffect(() => {
        fetch(imagedataurl)
            .then(response => response.json())
            .then(data => {
                const sortedData = data.sort((a, b) => a.order - b.order);
                setImageData(sortedData);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);
    return (
        <div>
            <Box color={"#f2f3f8"}>
                <NavbarHome />
                <Box>
                    <Box sx={{ display: { xs: "none", sm: "none", md: "block" } }}>
                        <Sidebar />
                    </Box>
                    <Box sx={{ marginLeft: { xs: "0px", sm: "0px", md: "100px" },paddingLeft: "15px", paddingRight: "15px", paddingTop: '10px', display: "flex", 
                    flexDirection: "column", alignItems: "center", gap: '15px', height: {xs:"calc(100vh - 144px)",sm:"calc(100vh - 144px)",md:"calc(100vh - 64px)"} }} overflowY={"auto"}>
                        <img src="images/LATEST RELEASE.png" alt="latestrelease" style={{ width: "300px" }} />
                        {imageData.map((image, index) => (
                            <Link key={index} to={image.path}>
                                <Box component={'img'} src={image.src} sx={{ width: { xs: "calc(70vw + 60px)", sm: "calc(60vw + 60px)" }, height: 'auto', borderRadius: '15px' }} />
                            </Link>
                        ))}
                        <div style={{ height: '1px', padding: '10px' }}>
                            <br />
                        </div>
                    </Box>
                    <Box sx={{ display: { xs: "block", sm: "block", md: "none" } }}><BottomNav /></Box>
                </Box>
            </Box>
        </div>
    );
}

export default Listofnews