import React, { useEffect, useState } from "react";
import { Box } from "@mui/material"
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav"
import { Helmet } from "react-helmet";

const AcardTKNpage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (searchValue) => {
    setSearchQuery(searchValue);
  };
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "webmanifest";
    link.href = `${process.env.PUBLIC_URL}/manifest.json`; // Equivalent to %PUBLIC_URL%
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);
  return (
    <div>
      <Helmet>
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </Helmet>
      <Box color={"#f2f3f8"}>
        <Navbar onSearch={handleSearch} />
        <Box>
            <Box sx={{ display: { xs: "none", sm: "none", md: "block" } }}><Sidebar /></Box>
            <Box sx={{ marginLeft: { xs: "0px", sm: "0px", md: "100px" },paddingLeft:"18px",paddingRight:"18px",display:'flex',justifyContent:'center',alignItems:'center',height:'calc(100vh - 154px)'}}>
              <img src="/comingsoonbanner/CMGSOON.png" alt="comingsoon"/>
            </Box>
          <Box flex={2} sx={{ display: { xs: "block", sm: "block", md: "none" } }}><BottomNav /></Box>
        </Box>
      </Box>
    </div>
  );
}

export default AcardTKNpage