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
  const [showPopup, setShowPopup] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const digimon = "digimon/";
  const uacard = "unionarena/";
  const onepiece ="onepiece/";

  useEffect(() => {
    if (!localStorage.getItem("popupShown")) {
      setShowPopup(true);
    }
  }, []);

  const handleClosePopup = () => {
    setShowPopup(false);
    if (dontShowAgain) {
      localStorage.setItem("popupShown", "true");
    }
  };


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
      {showPopup && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#26252d', padding: '20px', borderRadius: '10px', maxWidth: '400px', textAlign: 'start' }}>
            <p><strong style={{ color: '#74CFFF' }}>Uniondeck</strong> is undergoing a revamp and moving forward will be taking on a new name called <strong style={{ color: '#7C4FFF', fontBorder: '#ffffff' }}>Geekstack</strong>.
              Revamp will take place slowly throughout each update and we hope to seek your understanding! :D
              <br /><br />This web app will be accessible via <strong><a style={{ color: '#74CFFF' }} href="www.uniondeck.dev">uniondeck.dev</a></strong> and eventually <strong>geekstack.dev</strong> as well.
              <br /><br />Stay tuned to our video guide via our Tiktok to know how to edit account details or even share a decklist for people to enjoy. You are most definitely welcomed to explore the features of the web app yourself as well</p>
            <div style={{ fontSize: '10px', display: 'flex', alignItems: 'center', paddingTop: '20px', paddingBottom: '20px' }}>
              <input
                style={{ width: '10px' }}
                type="checkbox"
                id="dontShowAgain"
                checked={dontShowAgain}
                onChange={() => setDontShowAgain(!dontShowAgain)}
              />
              <label htmlFor="dontShowAgain">Don't show this again</label>
            </div>
            <button style={{backgroundColor:"#74cfff",paddingTop:'3px',paddingBottom:'3px',paddingRight:'8px',paddingLeft:'8px',borderRadius:'5px',cursor:'pointer'}} onClick={handleClosePopup}>Okay</button>
          </div>
        </div>
      )}
      <Box ref={boxRef} sx={{ display: "flex", flexwrap: "nowrap", flex: "0 0 auto", flexDirection: "row", overflowX: "auto", overflowY: "hidden", justifyContent: justifyContent, width: "100%", paddingRight: "15px", gap: "20px", height: { xs: 248, sm: 360 }, }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : favorites.length > 0 ? (
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
                  color: favorites.includes(favorite) ? "#7C4FFF" : "white",
                }}
                onClick={() => handleFavorite(favorite)}
              >
                <Star />
                <span style={{ color: "#f2f3f8", textTransform: "uppercase" }}><strong>{favorite.pathname.replace(digimon, "").replace(uacard, "").replace(onepiece,"")}</strong></span>
              </IconButton>
            </div>
          ))
        ) : (
          <Box sx={{ height: { xs: 228, sm: 340 }, alignItems: "center", display: "flex", fontSize: "20px", fontWeight: "900" }}>
            <span style={{ padding: "30px", backgroundColor: "#240052", borderRadius: "10px" }}>You currently have no favourites. Do star them to add the pages to your favorite.</span>
          </Box>
        )}
      </Box>
    </>
  );
};

export default HomepageDashboard;
