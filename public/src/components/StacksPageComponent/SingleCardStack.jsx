import { Avatar, Box, Input, List, ListItem, ListItemAvatar, SwipeableDrawer, Typography } from "@mui/material";
import React, { useCallback, useState } from "react";
import { ArrowBack, BookmarkBorderOutlined, CommentOutlined, FavoriteBorderOutlined, Pentagon, Search, Send } from "@mui/icons-material";
import { ResponsiveImage } from "./../ResponsiveImage";
import CardFunctions from "./SingleCardStackFunc";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../Firebase";
import { useEffect } from "react";
import CommentPill from "./CommentPill";
import { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";



const SingleCardStack = ({ grpdata, index, setDrawerOpen, drawerOpen}) => {
    const data = grpdata;
    const deckuid = grpdata.id;
    const navigate = useNavigate();
    const inputRef = useRef(null);

    const handleDrawerOpen = useCallback((deckuid) => {
        navigate(`/stacks/${deckuid}`)
        setDrawerOpen(true);
    }, []);

    return (
        <>
            <Box key={index} sx={{
                paddingTop: '0px',
                height: !data.description ? '205px' : (data.selectedCards[0].imagesrc ? '240px' : '130px'),
                width: '100%', // Adjust width to fill the column
                backgroundColor: '#26262d',
                borderRadius: '10px',
                position: 'relative',
                border: 'none',
                overflow: 'hidden',
            }}
                onClick={() => handleDrawerOpen(deckuid)}>
                <Box sx={{ width: 'inherit', height: data.selectedCards[0].imagesrc ? '140px' : '0px', display: 'flex', justifyContent: 'center', alignItems: 'start', backgroundColor: '#26262d', overflow: 'hidden', }}>
                    {data.selectedCards[0].imagesrc && <img src={data.selectedCards[0].imagesrc} alt='name' style={{ width: '200px', height: 'calc(200px * 1.395)', marginTop: '-30px' }} />}
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: '5px', position: 'absolute', left: '0px', top: data.selectedCards[0].imagesrc ? '120px' : '0px', }}>
                    <Box sx={{ borderRadius: '30px', border: '4px solid #26262d', width: '40px', height: '40px', overflow: 'hidden', backgroundColor: '#7C4FFF' }}>
                        {data.photoURL ? <img src={data.photoURL} alt={data.photoURL} style={{ width: '40px', height: 'auto' }} /> :
                            <div
                                style={{
                                    display: 'none',
                                    width: '40px',
                                    height: '40px',
                                    textAlign: 'center',
                                    lineHeight: '40px',
                                    color: '#f2f3f8'
                                }}
                            >
                                {data.displayName.charAt(0).toUpperCase()}
                            </div>}
                    </Box>
                    <Box sx={{ fontSize: '14px', color: '#f2f8fc', fontWeight: '900', marginTop: data.selectedCards[0].imagesrc ? '22px' : '10px', }}>{data.displayName}</Box>
                </Box>
                <Box sx={{
                    display: 'flex', flexDirection: 'column', gap: '7px', width: '150px',
                    color: '#f2f8fc', height: !data.description ? '35px' : (data.selectedCards[0].imagesrc ? '70px' : '100px'), fontSize: '10px', paddingLeft: '10px', paddingRight: '10px', justifyContent: 'start', flex: 'none'
                }}>
                    <Box sx={{ height: !data.description ? '16px' : (data.selectedCards[0].imagesrc ? '25px' : '40px') }}></Box>
                    {data.description && data.description.split('\n').map((line, i) => (
                        <React.Fragment key={i}>
                            {line}
                            <br />
                        </React.Fragment>
                    ))}
                </Box>
                <Box sx={{ color: '#D3D3D3', paddingBottom: '20px' }}>
                    <CardFunctions deck={data} handleDrawerOpen={handleDrawerOpen} inputRef={inputRef} />
                </Box>
            </Box>
        </>
    )
}

export default SingleCardStack;