import React, { useEffect, useState } from "react";
import { Box } from "@mui/material"
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav"
import { Helmet } from "react-helmet";
import CreateDeckBtn from "../components/ModularCreateDeckButton";
import PTCGcardFormat from "../components/PTCGPageComponent/PTCGcardTemplate";

const PTCGBTPage = () => {
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
          <Box sx={{ display: { xs: "none", sm: "none", md: "block" } }}>
            <Sidebar />
          </Box>
          <Box
            sx={{
              marginLeft: { xs: "0px", sm: "0px", md: "100px" },
              position: 'relative'
            }}
          >
            <PTCGcardFormat searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <Box sx={{ display: 'none' }}>
            <CreateDeckBtn contentType={"pokemon"}/>
            </Box>
          </Box>
          <Box sx={{ display: { xs: "block", sm: "block", md: "none" } }}>
            <BottomNav />
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default PTCGBTPage;
