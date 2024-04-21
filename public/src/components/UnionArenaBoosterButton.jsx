import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, ButtonBase, IconButton } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { db } from "../Firebase";
import { doc, getDoc, setDoc, arrayUnion, } from "firebase/firestore";
import { Star } from "@mui/icons-material";

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

const ButtonList = () => {
  const buttonData = [
    {
      pathname: "cgh",
      alt: "code geass",
      imageSrc: "/images/deckimage1.jpg",
      imgWidth: "110%",
    },
    {
      pathname: "jjk",
      alt: "jujutsu no kaisen",
      imageSrc: "/images/deckimage2.jpg",
      imgWidth: "110%",
    },
    {
      pathname: "htr",
      alt: "hunter x hunter",
      imageSrc: "/images/deckimage3.jpg",
      imgWidth: "110%",
    },
    {
      pathname: "ims",
      alt: "idolmaster shiny colors",
      imageSrc: "/images/deckimage4.jpg",
      imgWidth: "110%",
    },
    {
      pathname: "kmy",
      alt: "demon slayer",
      imageSrc: "/images/deckimage5.jpg",
      imgWidth: "110%",
    },
    {
      pathname: "toa",
      alt: "tales of arise",
      imageSrc: "/images/deckimage6.jpg",
      imgWidth: "110%",
    },
    {
      pathname: "tsk",
      alt: "that time I reincarnated as a slime",
      imageSrc: "/images/deckimage7.jpg",
      imgWidth: "110%",
    },
    {
      pathname: "blc",
      alt: "bleach: thousand-year blood war",
      imageSrc: "/images/deckimage8.jpg",
      imgWidth: "110%",
    },
    {
      pathname: "btr",
      alt: "me & robocco",
      imageSrc: "/images/deckimage9.jpg",
      imgWidth: "110%",
    },
    {
      pathname: "mha",
      alt: "my hero academia",
      imageSrc: "/images/deckimage10.jpg",
      imgWidth: "110%",
    },
    {
      pathname: "gnt",
      alt: "gintama",
      imageSrc: "/images/deckimage11.jpg",
      imgWidth: "110%",
    },
    {
      pathname: "blk",
      alt: "bluelock",
      imageSrc: "/images/deckimage12.jpg",
      imgWidth: "110%",
    },
    {
      pathname: "tkn",
      alt: "tekken 7",
      imageSrc: "/images/deckimage13.jpg",
      imgWidth: "110%",
    },
    {
      pathname: "dst",
      alt: "dr. stone",
      imageSrc: "/images/deckimage14.jpg",
      imgWidth: "110%",
    },
    {
      pathname: "sao",
      alt: "sword art online",
      imageSrc: "/images/deckimage15.jpg",
      imgWidth: "110%",
    },
    {
      pathname: "syn",
      alt: "synduality noir",
      imageSrc: "/images/deckimage16.jpg",
      imgWidth: "110%",
    },
    {
      pathname: "trk",
      alt: "toriko",
      imageSrc: "/images/deckimage17.jpg",
      imgWidth: "110%", 
    },
    {
      pathname: "nik",
      alt: "goddess of victory : nikke",
      imageSrc: "/images/deckimage18.jpg",
      imgWidth: "110%",
    },
    {
      pathname: "hiq",
      alt: "haikyu!!",
      imageSrc: "/images/deckimage19.jpg",
      imgWidth: "110%",
    },
    {
      pathname: "bcv",
      alt: "black clover",
      imageSrc: "/images/deckimage20.jpg",
      imgWidth: "110%",
    },
    {
      pathname: "yyh",
      alt: "yuyu hakusho",
      imageSrc: "/images/deckimage21.jpg",
      imgWidth: "110%",
    }
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

export default ButtonList;
