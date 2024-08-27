import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, ButtonBase, IconButton } from "@mui/material";
import { Star } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { arrayUnion, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../Firebase";
import axios from 'axios';

const MyButton = ({ pathname, alt, imageSrc, imgWidth, symbolSrc, setName }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const { currentUser } = useAuth();
  const game = "pokemon/";

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

  return (<Box sx={{display:'flex',flexDirection:'column'}}>
    <div style={{ position: 'relative' }}>
      <Link to={{ pathname }} style={{ textDecoration: "none", }}>
        <ButtonBase
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            bgcolor: "#1B2631",
            borderRadius: 3,
            boxShadow: 5,
            overflow: "hidden",
            width: {xs:176,sm:220},
            height: {xs:160,sm:200},
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
        <Box sx={{ backgroundImage: 'linear-gradient(to right bottom, #241f4b, #1d1f4a, #161e48, #0d1e47, #031d45);', borderRadius: '50%', padding: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {isFavorited ? (<Star sx={{ fontSize: '25px', color: '#FFC000', transition: 'color 0.5s ease-in-out' }} />) : (<Star sx={{ fontSize: '25px', color: '#F2F3F8', transition: 'color 0.5s ease-in-out' }} />)}
        </Box>
      </IconButton>
    </div>
    <Box sx={{ display: 'flex', gap: '8px', width: {xs:176,sm:220},paddingTop:'8px',paddingLeft:'2px', alignItems: 'center' }}>
      <img src={symbolSrc} style={{width:'20px',height:'auto'}} />
      {setName}
    </Box>
  </Box>
  );
};

const PTCGButtonList = () => {
  const [buttonData, setButtonData] = useState([]);

  useEffect(() => {
    const fetchButtonData = async () => {
      try {
        const response = await axios.get('https://api.pokemontcg.io/v2/sets');
        const apiData = response.data.data;

        // Map API data to your button format
        const mappedData = apiData.map((set) => ({
          pathname: set.id,
          alt: `${set.name} - ${set.series} [${set.id.toUpperCase()}]`,
          imageSrc: set.images.logo, // or use set.images.symbol if needed
          symbolSrc: set.images.symbol,
          setName: set.name,
          imgWidth: '90%',
        })).reverse();

        setButtonData(mappedData);
      } catch (error) {
        console.error('Error fetching data from API:', error);
      }
    };

    fetchButtonData();
  }, []);

  return (
    <>
      {buttonData.map((button) => (
        <MyButton
          key={button.pathname}
          pathname={button.pathname}
          alt={button.alt}
          imageSrc={button.imageSrc}
          imgWidth={button.imgWidth}
          symbolSrc={button.symbolSrc}
          setName={button.setName}
        />
      ))}
    </>
  );
};

export default PTCGButtonList;
