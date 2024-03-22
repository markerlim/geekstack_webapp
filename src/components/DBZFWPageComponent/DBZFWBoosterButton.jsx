import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, ButtonBase, IconButton } from "@mui/material";
import { Star } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { arrayUnion, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../Firebase";

const MyButton = ({ pathname, alt, imageSrc, imgWidth }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const { currentUser } = useAuth();
  const game = "unionarena/";

  useEffect(() => {
    if (currentUser) {
      // Check if the current button is favorited by the user
      const checkFavorite = async () => {
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnapshot = await getDoc(docRef);

          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            if (userData?.favorites) {
              const isFav = userData.favorites.some(favorite =>
                favorite.pathname.replace(game, "") === pathname && favorite.alt === alt && favorite.imageSrc === imageSrc
              );

              if (isFav) {
                setIsFavorited(true);
              }
            }
          }
        } catch (error) {
          console.error("Error checking favorite status:", error);
        }
      };

      checkFavorite();
    }
  }, [currentUser, pathname, alt, imageSrc]);

  const handleFavorite = async () => {
    setIsFavorited(!isFavorited);
    if (currentUser) {
      try {
        const userDocRef = doc(db, "users", currentUser.uid);
        const favoriteData = { pathname, alt, imageSrc, imgWidth };
        favoriteData.pathname = game + favoriteData.pathname

        if (isFavorited) {
          // If already favorited, remove it
          // You would need to retrieve the user's favorites, filter out the favorite to be removed, and then update the document
          const docSnapshot = await getDoc(userDocRef);
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            const newFavorites = userData.favorites.filter(favorite =>
              favorite.pathname.replace(game, "") !== pathname || favorite.alt !== alt || favorite.imageSrc !== imageSrc
            );

            await setDoc(userDocRef, { favorites: newFavorites }, { merge: true });
          }
        } else {
          // If not favorited, add it
          const userDoc = { favorites: arrayUnion(favoriteData) };
          await setDoc(userDocRef, userDoc, { merge: true });
        }
      } catch (error) {
        console.error("Error updating favorite status:", error);
      }
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <Link to={{ pathname }} style={{ textDecoration: "none" }}>
        <ButtonBase
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            bgcolor: "#121212",
            borderRadius: 3,
            boxShadow: 5,
            overflow: "hidden",
            width: { xs: 125, sm: 200 },
            height: { xs: 188, sm: 300 },
          }}
        >
          <img
            src={imageSrc}
            alt={alt}
            style={{ width: `${imgWidth}`, height: "auto" }}
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
        onClick={handleFavorite}
      >
        <Box sx={{backgroundImage:'linear-gradient(to right bottom, #241f4b, #1d1f4a, #161e48, #0d1e47, #031d45);',borderRadius:'50%',padding:'5px',display:'flex',alignItems:'center',justifyContent:'center'}}>
          {isFavorited ? (<Star sx={{ fontSize: '25px',color:'#FFC000', transition: 'color 0.5s ease-in-out' }} />) : (<Star sx={{ fontSize: '25px', color: '#F2F3F8', transition: 'color 0.5s ease-in-out' }} />)}
        </Box>
      </IconButton>
    </div>
  );
};

const DBZFWButtonList = () => {
  const buttonData = [
    {
      pathname: "fb01",
      alt: "BOOSTER PACK -AWAKENED PULSE- [FB01]",
      imageSrc: "/DBZFW/DBZFWCOVER/fb01cover.jpg",
      imgWidth: "110%",
    },
    {
      pathname: "fs01",
      alt: "STARTER DECK -SON GOKU- [FS01]",
      imageSrc: "/DBZFW/DBZFWCOVER/fs01cover.jpg",
      imgWidth: "110%",
    },
    {
      pathname: "fs02",
      alt: "STARTER DECK -VEGETA- [FS02]",
      imageSrc: "/DBZFW/DBZFWCOVER/fs02cover.jpg",
      imgWidth: "110%",
    },
    {
      pathname: "fs03",
      alt: "STARTER DECK -BROLY- [FS03]",
      imageSrc: "/DBZFW/DBZFWCOVER/fs03cover.jpg",
      imgWidth: "110%",
    },
    {
      pathname: "fs04",
      alt: "STARTER DECK -FRIEZA- [FS04]",
      imageSrc: "/DBZFW/DBZFWCOVER/fs04cover.jpg",
      imgWidth: "110%",
    },
  ];

  return (
    <>
      {buttonData.map((button) => (
        <MyButton
          key={button.pathname}
          pathname={button.pathname}
          alt={button.alt}
          imageSrc={button.imageSrc}
          imgWidth={button.imgWidth}
        />
      ))}
    </>
  );
};

export default DBZFWButtonList;
