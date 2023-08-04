import React, { useState, useEffect } from "react";
import { auth, db, storage } from '../Firebase';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { TextField, Button, Box, IconButton } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const AccountDetails = () => {
    const [displayNamex, setDisplayNamex] = useState("");
    const [photoURLx, setPhotoURLx] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [err, setErr] = useState(false);

    useEffect(() => {
        if (auth.currentUser) {
            setDisplayNamex(auth.currentUser.displayName);
            setPhotoURLx(auth.currentUser.photoURL);
        }
    }, []);


    const handleImageChange = async (e) => {
        if (e.target.files[0]) {
            setSelectedImage(e.target.files[0]);
            const file = e.target.files[0];
            try {
                // Delete the old image if it exists in Firebase Storage
                if (photoURLx.startsWith('https://firebasestorage.googleapis.com')) {
                    const oldImageRef = ref(storage, photoURLx);
                    await deleteObject(oldImageRef);
                }

                // Upload the new image
                const storageRef = ref(storage, `userdp/${file.name}`);
                const uploadTask = uploadBytesResumable(storageRef, file);

                uploadTask.on('state_changed',
                    (snapshot) => { },
                    (error) => {
                        console.log(error);
                    },
                    async () => {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        setPhotoURLx(downloadURL);
                    }
                );
            } catch (err) {
                console.error(err);
                setErr(true);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await updateProfile(auth.currentUser, {
                displayName: displayNamex,
                photoURL: photoURLx
            });

            // Update user document in Firestore
            const userDocRef = doc(db, 'users', auth.currentUser.uid);
            await setDoc(userDocRef, {
                displayName: displayNamex,
                photoURL: photoURLx
            }, { merge: true }); // merge: true to prevent overwriting the entire document

            setErr(false);
        } catch (err) {
            console.error(err);
            setErr(true);
        }
    };




    return (
        <Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "center" }}>
                <span style={{ fontSize: '30px', color: '#f2f3f8' }}><strong>Account Details</strong></span>
                <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                    <Box sx={{ borderRadius: '100px', border: '4px solid #7C4FFF ', overflow: 'hidden', width: '200px', height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <img src={photoURLx} style={{ width: '250px', backgroundColor: '#26252D' }} alt="displaypic" />
                    </Box>
                    <span style={{ color: '#f2f3f8' }}>Recomended to use a photo that is 200px by 200px</span>
                    <label style={{ position: "absolute",right:'70px',top:'180px' }} htmlFor="icon-button-file">
                        <input
                            id="icon-button-file"
                            type="file"
                            style={{ display: "none" }}
                            onChange={handleImageChange}
                        />
                        <IconButton
                            color="primary"
                            aria-label="upload picture"
                            component="span"
                            sx={{ color: '#7C4FFF' }}
                        >
                            <PhotoCamera />
                        </IconButton>
                    </label>
                </Box>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <TextField
                        value={displayNamex}
                        onChange={(e) => setDisplayNamex(e.target.value)}
                        label="Display Name"
                        variant="filled"
                        sx={{
                            width: '300px',
                            backgroundColor: '#26252D',
                            borderRadius: '10px',
                            '& input': {
                                color: '#f2f3f8',
                            },
                            '& label': {
                                color: '#f2f3f8',
                            },
                            '& label.Mui-focused': {
                                color: '#f2f3f8',
                            },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'transparent',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'transparent',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'transparent',
                                },
                            },
                        }}
                    />
                    <Button type="submit"
                    sx={{padding:"5px",borderRadius:'5px',backgroundColor: '#26252D',color:'#7C4FFF'}}>Save</Button>
                    {err && <span style={{ color: "red" }}>Something went wrong</span>}
                </form>
            </Box>
        </Box>
    );
};

export default AccountDetails;
