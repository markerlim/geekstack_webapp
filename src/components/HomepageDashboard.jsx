import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../Firebase";
import { doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { Link } from "react-router-dom";
import { Box, ButtonBase, IconButton } from "@mui/material";
import { Star } from "@mui/icons-material";

const HomepageDashboard = () => {
  const [favorites, setFavorites] = useState([]);
  const { currentUser } = useAuth();
  const [justifyContent, setJustifyContent] = useState('flex-start');
  const boxRef = useRef(null);
  const digimon = "digimon/";
  const uacard ="unionarena/";

  useEffect(() => {
    const handleResize = () => {
      if (!boxRef.current) return;

      let childWidth = 0;
      for (let child of boxRef.current.children) {
        childWidth += child.getBoundingClientRect().width;
      }

      if (childWidth > boxRef.current.getBoundingClientRect().width) {
        setJustifyContent('flex-start');
      } else {
        setJustifyContent('center');
      }
    }

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, [favorites]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          setFavorites(userData.favorites || []);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };
    if (currentUser) {
      fetchFavorites();
    }
  }, [currentUser]);

  const handleFavorite = async (favorite) => {
    try {
      const userDocRef = doc(db, "users", currentUser.uid);

      // Get current user document snapshot
      const docSnap = await getDoc(userDocRef);
      // Extract current favorites
      const currentFavorites = docSnap.data().favorites || [];
      // Find the favorite to be removed
      const favoriteToRemove = currentFavorites.find(
        (fav) =>
          fav.pathname === favorite.pathname &&
          fav.alt === favorite.alt &&
          fav.imageSrc === favorite.imageSrc &&
          fav.imgWidth === favorite.imgWidth
      );

      if (favoriteToRemove) {
        await updateDoc(userDocRef, {
          favorites: arrayRemove(favoriteToRemove),
        });

        setFavorites(currentFavorites.filter((fav) => fav !== favoriteToRemove));
      }
    } catch (error) {
      console.error("Error removing from favorites:", error);
    }
  };


  return (
    <Box ref={boxRef} sx={{ display: "flex", flexwrap: "nowrap", flex: "0 0 auto", flexDirection: "row", overflowX: "auto", overflowY: "hidden", justifyContent: justifyContent, width: "100%",paddingRight:"15px", gap: "20px", height: { xs: 248, sm: 360 }, }}>
      {favorites.length > 0 ? (
        favorites.map((favorite, index) => (
          <div key={index}>
            <Link to={{ pathname: `/${favorite.pathname}` }} sx={{ textDecoration: "none" }}>
              <ButtonBase
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  bgcolor: "#121212",
                  borderRadius: 5,
                  boxShadow: 5,
                  overflow: "hidden",
                  width: { xs: 125, sm: 200 },
                  height: { xs: 188, sm: 300 },
                }}
              >
                <img
                  src={favorite.imageSrc}
                  alt={favorite.alt}
                  style={{ width: `${favorite.imgWidth}`, height: "auto" }}
                />
              </ButtonBase>
            </Link>
            <IconButton
              sx={{
                color: favorites.includes(favorite) ? "#CCff00" : "white",
              }}
              onClick={() => handleFavorite(favorite)}
            >
              <Star />
              <span style={{ color: "#f2f3f8", textTransform: "uppercase" }}><strong>{favorite.pathname.replace(digimon, "").replace(uacard,"")}</strong></span>
            </IconButton>
          </div>
        ))
      ) : (
        <Box sx={{ height: { xs: 228, sm: 340 }, alignItems: "center", display: "flex", fontSize: "20px", fontWeight: "900" }}>
          <span style={{padding:"30px",backgroundColor:"#240052",borderRadius:"10px"}}>You currently have no favourites. Do star them to add the pages to your favorite.</span>
        </Box>
      )}
    </Box>
  );
};

export default HomepageDashboard;
