import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ButtonBase, IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useAuth } from "../context/AuthContext";
import { db } from "../Firebase";
import { doc, getDoc, setDoc, arrayUnion, arrayRemove } from "firebase/firestore";

const MyButton = ({ pathname, alt, imageSrc }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const { currentUser } = useAuth();

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
                favorite.pathname === pathname && favorite.alt === alt && favorite.imageSrc === imageSrc
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
        const favoriteData = { pathname, alt, imageSrc };

        if (isFavorited) {
          // If already favorited, remove it
          // You would need to retrieve the user's favorites, filter out the favorite to be removed, and then update the document
          const docSnapshot = await getDoc(userDocRef);
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            const newFavorites = userData.favorites.filter(favorite =>
              favorite.pathname !== pathname || favorite.alt !== alt || favorite.imageSrc !== imageSrc
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
    <div>
      <Link to={{ pathname }} style={{ textDecoration: "none" }}>
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
            src={imageSrc}
            alt={alt}
            style={{ width: "140%", height: "auto" }}
          />
        </ButtonBase>
      </Link>
      <IconButton
        sx={{
          color: isFavorited ? "red" : "white",
        }}
        onClick={handleFavorite}
      >
        <FavoriteIcon />
      </IconButton>
    </div>
  );
};

const ButtonList = () => {
  const buttonData = [
    {
      pathname: "cgh",
      alt: "code geass",
      imageSrc: "/images/deckimage1.jpg"
    },
    {
      pathname: "jjk",
      alt: "jujutsu no kaisen",
      imageSrc: "/images/deckimage2.jpg"
    },
    {
      pathname: "hxh",
      alt: "hunter x hunter",
      imageSrc: "/images/deckimage3.jpg"
    },
    {
      pathname: "ims",
      alt: "idolmaster shiny colors",
      imageSrc: "/images/deckimage4.jpg"
    },
    {
      pathname: "kmy",
      alt: "demon slayer",
      imageSrc: "/images/deckimage5.jpg"
    },
    {
      pathname: "toa",
      alt: "tales of arise",
      imageSrc: "/images/deckimage6.jpg"
    },
    {
      pathname: "tsk",
      alt: "that time I reincarnated as a slime",
      imageSrc: "/images/deckimage7.jpg"
    },
    {
      pathname: "btr",
      alt: "me & robocco",
      imageSrc: "/images/deckimage9.jpg"
    },
    {
      pathname: "mha",
      alt: "my hero academia",
      imageSrc: "/images/deckimage10.jpg"
    },
    // Add more button data as needed
  ];

  return (
    <>
      {buttonData.map((button) => (
        <MyButton
          key={button.pathname}
          pathname={button.pathname}
          alt={button.alt}
          imageSrc={button.imageSrc}
        />
      ))}
    </>
  );
};

export default ButtonList;
