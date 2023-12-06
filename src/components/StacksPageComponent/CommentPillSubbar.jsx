import { Box } from "@mui/material";
import React from "react";

const CommentPillSubbar = ({ index, handleDeleteComment, comment }) => {
    const handleDelete = () => {
        handleDeleteComment(index);
    };

    const calculateTimeSinceComment = () => {
        let commentTimestamp;
    
        if (comment.timestamp instanceof Date) {
            // If comment.timestamp is already a JavaScript Date
            commentTimestamp = comment.timestamp;
        } else if (comment.timestamp && comment.timestamp.toDate instanceof Function) {
            // If comment.timestamp is a Firestore Timestamp, convert it to JavaScript Date
            commentTimestamp = comment.timestamp.toDate();
        } else {
            // Handle the case where comment.timestamp is neither a Date nor a Firestore Timestamp
            return "Invalid timestamp";
        }
    
        const currentTime = new Date();
        const timeDifference = currentTime - commentTimestamp;
    
        const seconds = Math.floor(timeDifference / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
    
        if (days > 0) {
            return `${days}d ago`;
        } else if (hours > 0) {
            return `${hours}h ago`;
        } else if (minutes > 0) {
            return `${minutes}m ago`;
        } else {
            return `${seconds}s ago`;
        }
    };     
    
    const timeSinceComment = calculateTimeSinceComment();

    return (
        <Box sx={{ display: 'flex', gap: '5px', width: '100%',color: '#909394',alignItems:'center' }}>
            <Box sx={{color:'#C8A2C8',cursor: 'pointer', fontSize: '12px' }}>
                {timeSinceComment}
            </Box>
            <Box>
                -
            </Box>
            <Box sx={{cursor: 'pointer', fontSize: '12px' }}>
                Like
            </Box>
            <Box>
                -
            </Box>
            <Box sx={{cursor: 'pointer', fontSize: '12px' }}>
                Reply
            </Box>
            <Box>
                -
            </Box>
            <Box sx={{cursor: 'pointer', fontSize: '10px', fontWeight:'900' }} onClick={handleDelete}>
                DELETE
            </Box>
        </Box>
    )
}

export default CommentPillSubbar;