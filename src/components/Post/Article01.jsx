import { Box } from "@mui/material";
import React from "react";
const Article01 = () => {
    return (
        <div>
            <Box paddingLeft={3} paddingRight={3}>
                <article style={{ lineHeight: "30px", fontSize: "16px" }}>
                    <Box className="articleheader" sx={{ display: "flex", flexDirection: "row", gap: "20px", margin: "30px", justifyContent: "center" }}>
                        <img style={{ width: "225px", height: "auto",marginRight:"-50px"}} src="/UD/JJK-1-063.png" alt="JJK-1-063" />
                        <img style={{ width: "250px", height: "auto",zIndex:0, boxShadow:"0 6px 20px rgba(0, 0, 0, 1)",borderRadius:"10px"}} src="/UD/JJK-1-105.png" alt="JJK-1-105" />
                        <img style={{ width: "225px", height: "auto",marginLeft:"-50px"}} src="/UD/JJK-1-061.png" alt="JJK-1-061" />
                        <span data-text="Sukuna"></span>
                        <span data-text="Finger"></span>
                    </Box>
                    <div style={{height:"100px"}}/>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: "20px", margin: "30px", paddingLeft:"400px",paddingRight:"400px",justifyContent: "center" }}>
                        written by DPP Channel
                        <br />
                        <br />
                        <span><strong>Hey Hey Hey!</strong></span>
                        <br />
                        <br />
                        Welcome to the first ‘Deck Dive’ where we explore Deck Lists together – understanding more about the key cards and gameplan. The purpose of the article aims to help new players to get into the game by having a better idea on how they can play their favourite deck. Union Arena has tons of Animes under its belt – Hunter X Hunter, Jujustu Kaisen, Code Geass, Tales of Arise and Demon Slayer for example.
                        <br />
                        <br />
                        The gameplays for the decks are different from each other and is what contributes to the fun factor of having to pilot a variety of decks. However, this can get confusing and overwhelming for players who are looking to get into the game. Hence, with these articles, we hope we can solve that by giving people a better insight of what to expect from the decks.
                        <br />
                        <br />
                        Before we begin, do note that the Deck List shared is in no way the best and this is our opinion only.
                    </Box>
                </article>
                <Box>
                    <Box display={"flex"} flexDirection={"column"} sx={{ textAlign: "center" }} style={{ width: "75px", height: "120px" }}>
                        <img
                            loading="lazy"
                            src="/UD/CGH-1-003.png"
                            draggable="false"
                            alt="CGH-1-003.png"
                            className="image-responsive"
                            style={{ width: "75px", height: "105.463125px" }}
                        />
                        <span>4</span>
                    </Box>
                </Box>
                <article>Key cards</article>
                <article>Mulligan</article>
                <article>General Gameplan</article>
                <div style={{ height: "200px" }}></div>
            </Box>
        </div>
    );
}

export default Article01