import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Capacitor } from '@capacitor/core';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { auth } from "../Firebase";
import { Box, CircularProgress } from "@mui/material";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { Google } from "@mui/icons-material";

const LoginModal = () => {
    const [err, setErr] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const db = getFirestore();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async user => {
            if (user) {
                console.log('User is signed in');

                // Check if the user document exists in Firestore
                const userDocRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userDocRef);

                if (!userDoc.exists()) {
                    console.log('Creating user document in Firestore');
                    await setDoc(userDocRef, {
                        uid: user.uid,
                        displayName: user.displayName,
                        email: user.email,
                        photoURL: user.photoURL,
                    });
                } else {
                    console.log('User document already exists');
                }

                navigate('/');
            } else {
                console.log('No user is signed in');
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [navigate, db]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err) {
            setErr(true);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            if (Capacitor.getPlatform() === 'ios' || Capacitor.getPlatform() === 'android' ) {
                // Capacitor (Mobile) logic
                await GoogleAuth.initialize({
                    clientId: '380411056228-p971cril6cmvn5heev4n6q2n8pp8t4qa.apps.googleusercontent.com', // Replace with your web client ID from Google Cloud Console
                    scopes: ['profile', 'email'], // Optional: Scopes you need
                    forceCodeForRefreshToken: true, // Optional: Use code flow for refresh tokens
                }
                ); // Initialize for Capacitor
                const googleUser = await GoogleAuth.signIn();

                console.log('Google User (Mobile):', googleUser);

                const credential = GoogleAuthProvider.credential(googleUser.authentication.idToken);
                await signInWithCredential(auth, credential);
            } else {
                // Web logic
                const provider = new GoogleAuthProvider();
                const result = await signInWithPopup(auth, provider);

                console.log('Google User (Web):', result.user);
            }

            console.log('Google Sign-in completed');
        } catch (err) {
            console.error(err);
            setErr(true);
        }
    };

    if (loading) return <div><CircularProgress /></div>;
    return (
        <Box className="formWrapper">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1px', alignItems: 'center', justifyContent: 'center' }}>
                <div className="logo">
                    <Box p={1}><img style={{ width: "auto", height: "80px" }} alt="uniondeck" src="/icons/geekstackicon.svg" /></Box>
                </div>
                <div style={{ fontFamily: 'league spartan', fontSize: '30px', color: '#121212' }}><strong>GEEKSTACK</strong></div>
            </Box>
            <span className="title">Welcome to the place for Cards!</span>
            <form style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} onSubmit={handleSubmit}>
                <input style={{ width: '200px' }} type="email" placeholder="Email" />
                <input style={{ width: '200px' }} type="password" placeholder="Password" />
                <button style={{ width: '200px', borderRadius: '10px' }}>Login</button>
                {err && <span style={{ color: "red" }}>something went wrong</span>}
            </form>
            <button style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 4, border: "none", padding: 5, cursor: "pointer", borderRadius: "5px", backgroundColor: "#784C9A", color: "#f2f3f8" }} onClick={handleGoogleSignIn}>
                <Google /><span>Login with Google</span>
            </button>
            <p>Don't have an account? <Link to="/register">Register</Link></p>
        </Box>
    )
}

export default LoginModal;