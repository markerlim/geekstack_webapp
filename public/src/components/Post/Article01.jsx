import { Box, useTheme } from "@mui/material";
import React, { useEffect } from "react";
import { ResponsiveImageArticle } from "../ResponsiveImageArticle"
const Article01 = () => {
    useEffect(() => {
        document.body.id = "article01";

        // Cleanup function to remove id when component unmounts
        return () => {
            document.body.id = "";
        };
    }, []); // Empty dependency array so this runs once on mount and cleanup on unmount

    const theme = useTheme();
    const paddingStyles = {
        sm: {
            paddingLeft: theme.spacing("10%"),
            paddingRight: theme.spacing("10%"),
        },
        md: {
            paddingLeft: theme.spacing("20%"),
            paddingRight: theme.spacing("20%"),
        },
        lg: {
            paddingLeft: theme.spacing("40%"),
            paddingRight: theme.spacing("40%"),
        },
    };

    return (
        <div>
            <Box>
                <Box sx={{
                    lineHeight: "30px",
                    fontSize: "16px",
                    paddingRight: "10%",
                    paddingLeft: "10%",
                    paddingBottom: "20%",
                    marginTop: "-70px",
                    [theme.breakpoints.up("md")]: {
                        paddingRight: "20%",
                        paddingLeft: "20%",
                    },
                    [theme.breakpoints.up("lg")]: {
                        paddingRight: "20%",
                        paddingLeft: "20%",
                    },
                    [theme.breakpoints.up("xl")]: {
                        paddingRight: "30%",
                        paddingLeft: "30%",
                    },
                }}>
                    <Box className="articleheader" sx={{ display: "flex", flexDirection: "row", gap: "20px", margin: "30px", justifyContent: "center" }}>
                        <img style={{ width: "225px", height: "auto", marginRight: "-50px" }} src="/UD/JJK-1-063.png" alt="JJK-1-063" />
                        <img style={{ width: "250px", height: "auto", zIndex: 0, boxShadow: "0 6px 20px rgba(0, 0, 0, 1)", borderRadius: "10px" }} src="/UD/JJK-1-105.png" alt="JJK-1-105" />
                        <img style={{ width: "225px", height: "auto", marginLeft: "-50px" }} src="/UD/JJK-1-061.png" alt="JJK-1-061" />
                        <span data-text="Sukuna"></span>
                        <span data-text="Finger"></span>
                    </Box>
                    <div style={{ height: "100px" }} />
                    <Box sx={{ display: "flex", flexDirection: "column", gap: "20px", justifyContent: "center" }}>
                        written by DPP Channel
                        <br />
                        <span><strong>Hey Hey Hey!</strong></span>
                        Welcome to the first ‘Deck Dive’ where we explore Deck Lists together – understanding more about the key cards and gameplan. The purpose of the article aims to help new players to get into the game by having a better idea on how they can play their favourite deck. Union Arena has tons of Animes under its belt – Hunter X Hunter, Jujustu Kaisen, Code Geass, Tales of Arise and Demon Slayer for example.
                        <br />
                        <br />
                        The gameplays for the decks are different from each other and is what contributes to the fun factor of having to pilot a variety of decks. However, this can get confusing and overwhelming for players who are looking to get into the game. Hence, with these articles, we hope we can solve that by giving people a better insight of what to expect from the decks.
                        Before we begin, do note that the Deck List shared is in no way the best and this is our opinion only.
                        <br />
                        <br />
                    </Box>
                    <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                        Sukuna is a character from the famous Jujustu Kaisen and its being featured under the color of Blue in Union Arena. Blue characteristically has much more emphasis on cycling which plays well into the game-plan of the deck.
                    </Box>
                    <Box sx={{ justifyContent: "center", gap: "20px", display: "flex", flexDirection: "row", paddingTop: "20px", paddingBottom: "20px", }}>
                        <div className="card__img-wrapper">
                            <ResponsiveImageArticle src="/UD/JJK-1-063.png" alt="JJK-1-063" />
                            <div className="card__shine"><div className="card__shine-shimmer"></div></div>
                        </div>
                        <div className="card__img-wrapper">
                            <ResponsiveImageArticle src="/UD/JJK-1-038.png" alt="JJK-1-038" />
                            <div className="card__shine"><div className="card__shine-shimmer"></div></div>
                        </div>
                    </Box>
                    <Box>
                        The Engine of the deck. The card that makes the deck Sukuna.
                        They are easy to use and cycle as long as you have met the condition of having Yuji on the field.
                        Normally, you could rest your Yuji and then Raid directly after.
                        However, do keep in mind you have to set-up your Yuji first prior to using the finger as cards play initially in the game are suspended.
                    </Box>
                    <Box sx={{ justifyContent: "center", gap: "20px", display: "flex", flexDirection: "row", paddingTop: "20px", paddingBottom: "20px" }}>
                        <div className="card__img-wrapper">
                            <ResponsiveImageArticle src="/UD/JJK-1-061.png" alt="JJK-1-061" />
                            <div className="card__shine"><div className="card__shine-shimmer"></div></div>
                        </div>
                    </Box>
                    <Box>
                        The Domain Expansion of Sukuna - the win condition.
                        This card provides Sukuna extra abilities that make it pressuring for the opponent.
                        From gaining Double Attack to Snipe to Impact+1, this card is to be feared once your Sukuna Finger counts racks up fast in the Outside Area.
                    </Box>
                    <Box sx={{ justifyContent: "center", gap: "20px", display: "flex", flexDirection: "row", paddingTop: "20px", paddingBottom: "20px" }}>
                        <div className="card__img-wrapper">
                            <ResponsiveImageArticle src="/UD/JJK-1-105.png" alt="JJK-1-105" />
                            <div className="card__shine"><div className="card__shine-shimmer"></div></div>
                        </div>
                    </Box>
                    <Box>
                        There are a total of 3 versions of Sukuna currently in the game.
                        They all have their own purposes and strengths but this one easily takes the position of being the strongest.
                        It has a good on Raid ability that allows you to Draw 2 and Discard 1 which is part of the cycle that Sukuna deck requires.
                        Allowing you to cycle faster into the deck and getting those Sukuna Fingers stacked fast in the Outside Area.
                        Aside from the cycle, this card has a built-in Impact +1 that stacks pretty well with what Fukuma Mizhuchi has to offer.
                        A Sukuna that has both Snipe and Impact +2 is scary and can usually close games on opponent.
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                        <img src="/images/articlebg/JJKBGHEADER.png" alt="header" style={{ height: "200px", width: "700px" }} />
                        <span style={{ position: "absolute", paddingTop: "80px", fontSize: "50px", fontFamily: "Impact, 'Anton', Haettenschweiler, 'Arial Narrow Bold', sans-serif" }}>The Game Plan</span>
                    </Box>
                    <Box>
                        Sukuna gets stronger for each finger that it has access to - lore accurate to the show.
                        The general gameplan will be to get 4 fingers as fast as possible to the Outside Area.
                        With 4 fingers in the Outside Area, your Fukuma Mizuchi allows your Sukuna to gain strong abilities to overwhelm your opponents and potentially closing up games.
                        Get to your Sukuna Fingers faster with cycle cards such as Sukuna ST and Maki that accelerate the overall gameplan.
                        Let's not forget there are also Itadori Yuji and Sukuna BT that helps to search the Top 5 for those key pieces.
                        Once you have secured the Sukuna Fingers and having Fukuma Mizuchi in play, you would have the upper-hand in the games!
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                        <img src="/images/articlebg/JJKBGHEADER.png" alt="header" style={{ height: "200px", width: "700px" }} />
                        <span style={{ position: "absolute", paddingTop: "80px", fontSize: "50px", fontFamily: "Impact, 'Anton', Haettenschweiler, 'Arial Narrow Bold', sans-serif" }}>Weakness</span>
                    </Box>
                    <Box>
                        Sukuna relies heavily on getting its key pieces before it becomes a threat to the opponent.
                        Set-ups generally takes time and in this high-pace game of Union Arena, there might not be a good window to be 'farming'.
                        'Farming' against a Sukuna deck might not be wise as a Sukuna with Snipe and Impact 2 is pretty hard to beat.
                        Rushing down Sukuna would generally be a good idea to prevent them from reaching the full power of Sukuna.
                        Certain decks are also equipped with unique ways to deal with Sukuna in general such as Field Removals and also cards that place cards from the Outside Area to the Remove Area.
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                        <img src="/images/articlebg/JJKBGHEADER.png" alt="header" style={{ height: "200px", width: "700px" }} />
                        <span style={{ position: "absolute", paddingTop: "80px", fontSize: "50px", fontFamily: "Impact, 'Anton', Haettenschweiler, 'Arial Narrow Bold', sans-serif" }}>Conclusion</span>
                    </Box>
                    <Box>
                    Sukuna decks do have an addicting playstyle if you love to cycle through your cards. The deck does not has a steep learning curve and definitely is one that rewards good plays.
                    </Box>
                </Box>
                <Box>
                </Box>
            </Box>
        </div>
    );
}

export default Article01