
import { People } from "@mui/icons-material";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth,db,storage } from "../firebase";
import React, { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {doc,setDoc} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [err,setErr] = useState(false)
    const navigate = useNavigate()


    const handleSubmit = async (e)=>{
        e.preventDefault()
        const displayName = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const file = e.target[3].value;
        
        try{
            const res = await createUserWithEmailAndPassword(auth, email, password)

            const storageRef = ref(storage, displayName);

            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
            (error) => {
                setErr(true);
            }, 
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
                    await updateProfile(res.user,{
                        displayName,
                        photoURL: downloadURL,
                    });
                    await setDoc(doc(db,"users",res.user.uid),{
                        uid: res.user.uid,
                        displayName,
                        email,
                        photoURL: downloadURL,
                    });

                    await setDoc(doc(db,"userChats",res.user.uid),{})
                    navigate("/");

                });
            }
        );


        }catch(err){
            setErr(true);
        }
    };

    return(
        <div className="formContainer">
            <div className="formWrapper">
                <span className="logo">GEEK STACK</span>
                <span className="title">Sign up page</span>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Display name"/>
                    <input type="email" placeholder="Email"/>
                    <input type="password" placeholder="Password"/>
                    <input style={{display:"none"}} type="file" id="file"/>
                    <label htmlFor="file">
                        <People/>
                        <span>Add an avatar</span>
                    </label>
                    <button>Sign Up</button>
                    {err && <span>something went wrong</span>}
                </form>
                <p>Do you have an account? Login
                </p>
            </div>
        </div>
    )
}

export default Register