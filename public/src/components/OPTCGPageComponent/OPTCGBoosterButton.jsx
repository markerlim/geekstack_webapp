import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ButtonBase, IconButton } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../Firebase";
import { doc, getDoc, setDoc, arrayUnion, } from "firebase/firestore";
import { Star } from "@mui/icons-material";

const MyButton = ({ pathname, alt, imageSrc, imgWidth }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const { currentUser } = useAuth();
  const game = "onepiece/";

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
    <div>
      <Link to={{ pathname }} style={{ textDecoration: "none" }}>
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
            src={imageSrc}
            alt={alt}
            style={{ width: `${imgWidth}`, height: "auto" }}
          />
        </ButtonBase>
      </Link>
      <IconButton
        sx={{
          color: isFavorited ? "#7C4FFF" : "white",
        }}
        onClick={handleFavorite}
      >
        <Star />
        <span style={{ color: "#f2f3f8", textTransform: "uppercase" }}><strong>{pathname}</strong></span>
      </IconButton>
    </div>
  );
};
const extractNumericPart = (pathname) => {
  const matches = pathname.match(/\d+/);
  return matches ? parseInt(matches[0]) : NaN;
};

const extractAlphaPart = (pathname) => {
  const matches = pathname.match(/[a-zA-Z]+/);
  return matches ? matches[0] : "";
};

const customSort = (a, b) => {
  const alphaPartA = extractAlphaPart(a.pathname);
  const alphaPartB = extractAlphaPart(b.pathname);

  // First, compare the alphabet parts of the pathnames
  const alphaCompare = alphaPartA.localeCompare(alphaPartB);

  if (alphaCompare !== 0) {
    // If the alphabet parts are different, return the result of the alphabetical comparison
    return alphaCompare;
  }

  // If the alphabet parts are the same, compare the numeric parts
  const numericPartA = extractNumericPart(a.pathname);
  const numericPartB = extractNumericPart(b.pathname);

  if (!isNaN(numericPartA) && !isNaN(numericPartB)) {
    return numericPartA - numericPartB;
  } else {
    // Fallback to alphabetical sorting if any of the numeric parts is not found
    return a.pathname.localeCompare(b.pathname);
  }
};

const OPTCGButtonList = () => {
  const [buttonData, setButtonData] = useState([]);
  const url = `https://ap-southeast-1.aws.data.mongodb-api.com/app/data-fwguo/endpoint/optcgboosterlist?secret=${process.env.REACT_APP_SECRET_KEY}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const result = await response.json();
        const data = result.data;

        // Extract the 'pathname' from each object in the data array
        const extractedPathnames = data.map((item) => item.pathname);

        // Sort the extracted pathnames alphabetically
        extractedPathnames.sort();

        // Create a new array by sorting the original data array based on the sorted pathnames
        const sortedData = extractedPathnames.map((pathname) =>
          data.find((item) => item.pathname === pathname)
        ).sort(customSort);

        setButtonData(sortedData);
      } catch (error) {
        console.error("Fetch error data:", error);
      }
    };

    fetchData();
  }, [url]);


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

export default OPTCGButtonList;
