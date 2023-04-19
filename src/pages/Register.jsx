import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, storage, db } from "../Firebase";
import { doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { People } from "@mui/icons-material";

const Register = () => {
  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  const defaultAvatarUrl = "/images/Renee.png"; // Replace this with the actual URL of the default avatar image

  const handleSubmit = async (e) => {
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    const photoURL = file ? await uploadAndGetDownloadURL(file, displayName) : defaultAvatarUrl;

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(res.user, {
        displayName,
        photoURL,
      });
      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        displayName,
        email,
        photoURL,
      });

      await setDoc(doc(db, "userChats", res.user.uid), {});
      navigate("/");
    } catch (err) {
      setErr(true);
    }
  };

  const uploadAndGetDownloadURL = async (file, displayName) => {
    const storageRef = ref(storage, displayName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        () => {},
        (error) => {
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">GEEK STACK</span>
        <span className="title">Sign up page</span>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Display name" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <input style={{ display: "none" }} type="file" id="file" />
          <label htmlFor="file">
            <People />
            <span>Add an avatar (optional)</span>
          </label>
          <button>Sign Up</button>
          {err && <span>Something went wrong</span>}
        </form>
        <p>
          Do you have an account? <Link to="/Login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
