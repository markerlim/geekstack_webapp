import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../Firebase";
import { doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { Link } from "react-router-dom";
import { Box, ButtonBase, CircularProgress, IconButton } from "@mui/material";
import { Star } from "@mui/icons-material";

const HomepageDashboard = () => {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();
  const [justifyContent, setJustifyContent] = useState('flex-start');
  const boxRef = useRef(null);
  const uacard = "unionarena/";
  const onepiece = "onepiece/";


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
    } finally {
      setIsLoading(false); // Setting the loading state to false after fetching
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchFavorites();
    } else {
      setIsLoading(false);
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
    <>
      <Box ref={boxRef} sx={{ display: "flex", flexwrap: "nowrap", flex: "0 0 auto", flexDirection: "row", overflowX: "auto", overflowY: "hidden", justifyContent: justifyContent, width: "100%", paddingLeft: "15px", paddingRight: "15px",paddingBottom:'20px', gap: "20px", height: { xs: 188, sm: 300 }, }}>
        <Box sx={{ width: '30px' }}></Box>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : favorites.length > 0 ? (
          favorites.map((favorite, index) => (
            <div key={index} style={{position:'relative'}}>
              <Link to={{ pathname: `/${favorite.pathname}` }} sx={{ textDecoration: "none" }}>
                <ButtonBase
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    bgcolor: "#121212",
                    borderRadius: "10px",
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
                  position: 'absolute',
                  bottom: '5px',
                  right: '5px',
                  padding: '0px',
                  borderRadius: '50%',
                }}
                onClick={() => handleFavorite(favorite)}
              >
                <Box sx={{ backgroundImage: 'linear-gradient(to right bottom, #241f4b, #1d1f4a, #161e48, #0d1e47, #031d45);', borderRadius: '50%', padding: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {favorites.includes(favorite) ? (<Star sx={{ fontSize: '25px', color: '#FFC000', transition: 'color 0.5s ease-in-out' }} />) : (<Star sx={{ fontSize: '25px', color: '#F2F3F8', transition: 'color 0.5s ease-in-out' }} />)}
                </Box>
              </IconButton>
            </div>
          ))
        ) : (
          <Box sx={{ height: { xs: 228, sm: 340 }, alignItems: "center", display: "flex", fontSize: "20px", fontWeight: "900" }}>
            <span style={{ padding: "30px", backgroundColor: "#240052", borderRadius: "10px" }}>You currently have no favourites. Do star them to add the pages to your favorite.</span>
          </Box>
        )}
        <Box sx={{ width: '30px' }}></Box>
      </Box>
    </>
  );
};

export default HomepageDashboard;
