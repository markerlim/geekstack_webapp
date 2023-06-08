import { Box } from "@mui/material";
import React from "react";

const Article01 = () => {
    return (
        <div>
            <Box paddingLeft={3} paddingRight={3}>
                <article style={{ lineHeight: "30px",fontSize:"16px" }}>
                    <div style={{fontSize:"30px"}}><strong>LETS EAT FINGERS!!</strong></div>
                    written by DPP Channel
                    <br/>
                    <br/>
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
                </article>
                <Box>
                    <Box display={"flex"} flexDirection={"column"} sx={{ textAlign: "center" }} style={{width: "75px", height: "120px"}}>
                      <img
                        loading="lazy"
                        src="/UD/CGH-1-003.png"
                        draggable="false"
                        alt="CGH-1-003.png"
                        className="image-responsive"
                        style={{width: "75px", height: "105.463125px"}}
                      />
                      <span>4</span>
                    </Box>
                </Box>
                <article>Key cards</article>
                <article>Mulligan</article>
                <article>General Gameplan</article>
                <div style={{height:"200px"}}></div>
            </Box>
        </div>
    );
}

export default Article01