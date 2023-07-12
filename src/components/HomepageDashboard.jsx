import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../Firebase";
import { doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { Link } from "react-router-dom";
import { Box, ButtonBase, IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";

const HomepageDashboard = () => {
  const [favorites, setFavorites] = useState([]);
  const { currentUser } = useAuth();

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
      await updateDoc(userDocRef, {
        favorites: arrayRemove(favorite),
      });
      setFavorites(favorites.filter((item) => item !== favorite));
    } catch (error) {
      console.error("Error removing from favorites:", error);
    }
  };

  return (
    <div>
      <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
        {favorites.map((favorite, index) => (
          <Link to={{ pathname: `/${favorite.pathname}` }} style={{ textDecoration: "none" }}>
            <ButtonBase
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                bgcolor: "#121212",
                padding: 2,
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
                style={{ width: "140%", height: "auto" }}
              />
              <IconButton
                sx={{
                  position: "absolute",
                  top: 5,
                  right: 5,
                  color: favorites.includes(favorite) ? "red" : "white",
                }}
                onClick={() => handleFavorite(favorite)}
              >
                <FavoriteIcon />
              </IconButton>
            </ButtonBase>
          </Link>
        ))}
      </Box>
    </div>
  );
};

export default HomepageDashboard;
