import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { auth } from "../Firebase";
import { Box, CircularProgress } from "@mui/material";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { Google } from "@mui/icons-material";

const Login = () => {
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
        const provider = new GoogleAuthProvider();

        try {
            console.log('Attempting Google Sign-in');
            await signInWithPopup(auth, provider);
            console.log('Google Sign-in completed');
        } catch (err) {
            console.error(err);
            setErr(true);
        }
    };

    if (loading) return <div><CircularProgress/></div>;
    return (
        <div className="formContainer" style={{ marginTop: '-64px' }}>
            <div className="formWrapper">
                <span className="logo"><Box p={1}><img style={{ width: "auto", height: "80px" }} alt="uniondeck" src="/icons/geekstackicon.svg" /></Box></span>
                <span className="title">Time to play cards</span>
                <form onSubmit={handleSubmit}>
                    <input type="email" placeholder="Email" />
                    <input type="password" placeholder="Password" />
                    <button>Login</button>
                    {err && <span style={{ color: "red" }}>something went wrong</span>}
                </form>
                <button style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 4, border: "none", padding: 5, cursor: "pointer", borderRadius: "5px", backgroundColor: "#784C9A", color: "#f2f3f8" }} onClick={handleGoogleSignIn}>
                    <Google /><span>Login with Google</span>
                </button>
                <p>Don't have an account? <Link to="/register">Register</Link></p>
            </div>
        </div>
    )
}

export default Login
