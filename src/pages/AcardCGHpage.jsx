import React, { useEffect, useState } from "react";
import { Box } from "@mui/material"
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav"
import AcardCGH from "../components/AcardCGH";
import { Helmet } from "react-helmet";

const AcardCGHpage = () => {
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
      <Box bgcolor={"#121212"} color={"#f2f3f8"}>
        <Navbar onSearch={handleSearch} />
        <Box>
            <Box sx={{ display: { xs: "none", sm: "none", md: "block" } }}><Sidebar /></Box>
            <Box sx={{ marginLeft: { xs: "0px", sm: "0px", md: "100px" },paddingLeft:"18px",paddingRight:"18px"}}>
              <AcardCGH searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            </Box>
          <Box flex={2} sx={{ display: { xs: "block", sm: "block", md: "none" } }}><BottomNav /></Box>
        </Box>
      </Box>
    </div>
  );
}

export default AcardCGHpage