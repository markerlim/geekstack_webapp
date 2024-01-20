import { useEffect, useState } from 'react';
import { getDoc, doc } from 'firebase/firestore';
import { Box, CircularProgress, Typography } from '@mui/material';
import { db } from '../../Firebase';
import CommentPillSubbar from './CommentPillSubbar';

const CommentPill = ({ comment, isSubmitting, index, comments, handleDeleteComment }) => {
    const [userData, setUserData] = useState([]);

    useEffect(() => {
        const fetchUserComment = async () => {
            try {
                const userDoc = await getDoc(doc(db, 'users', comment.uid));

                if (userDoc.exists()) {
                    const newData = userDoc.data();
                    setUserData({
                        ...userData, // Spread the existing data
                        photoURL: newData.photoURL,
                        displayName: newData.displayName,
                    });
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserComment();
    }, [comment.uid]);

    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'column', backgroundColor: '#1f1f1f', border: '2px solid #4e4e4e', color: '#f2f8fc', padding: '8px', borderRadius: '7px', position: 'relative' }}>
                <Typography sx={{ fontSize: '14px' }}>
                    {userData.displayName}{isSubmitting && index === comments.length - 1 && (
                        <CircularProgress size={'8px'} sx={{ position: 'absolute', right: '8px', color: '#909394' }} />
                    )}
                </Typography>
                <Typography sx={{ fontSize: '12px' }}>{comment.text}</Typography>
            </Box>
            <CommentPillSubbar
                index={index}
                handleDeleteComment={handleDeleteComment}
                comment={comment} />
        </>

    )
}

export default CommentPill;