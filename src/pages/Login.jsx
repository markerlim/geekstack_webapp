import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../Firebase";
import { Box } from "@mui/material";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { Google } from "@mui/icons-material";

const Login = () => {
    const [err, setErr] = useState(false);
    const navigate = useNavigate();
    const db = getFirestore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/");
        } catch (err) {
            setErr(true);
        }
    };


    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
    
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
    
            // Check if the user document exists in Firestore
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);
    
            // If the user document doesn't exist, create it
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
    
            navigate("/");
        } catch (err) {
            console.error(err);
            setErr(true);
        }
    };
    



    return (
        <div className="formContainer">
            <div className="formWrapper">
                <span className="logo"><Box p={1}><img style={{ width: "auto", height: "80px" }} alt="uniondeck" src="/icons/uniondecklogosmall.png" /></Box></span>
                <span className="title">Login</span>
                <form onSubmit={handleSubmit}>
                    <input type="email" placeholder="Email" />
                    <input type="password" placeholder="Password" />
                    <button>Login</button>
                    {err && <span style={{color:"red"}}>something went wrong</span>}
                </form>
                <button style={{display:"flex", flexDirection:"row", alignItems:"center",gap:4,border:"none",padding:5,cursor:"pointer",borderRadius:"5px",backgroundColor:"#784C9A",color:"#f2f3f8"}}onClick={handleGoogleSignIn}><span>Login with Google</span><Google/></button>
                <p>Don't have an account? <Link to="/register">Register</Link></p>
            </div>
        </div>
    )
}

export default Login
