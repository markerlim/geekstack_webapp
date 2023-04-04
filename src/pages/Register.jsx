
import { People } from "@mui/icons-material";
import React from "react";

const Register = () => {
    return(
        <div className="formContainer">
            <div className="formWrapper">
                <span className="logo">GEEK STACK</span>
                <span className="title">Sign up page</span>
                <form>
                    <input type="text" placeholder="Display name"/>
                    <input type="email" placeholder="Email"/>
                    <input type="password" placeholder="Password"/>
                    <input style={{display:"none"}} type="file" id="file"/>
                    <label htmlFor="file">
                        <People/>
                        <span>Add an avatar</span>
                    </label>
                    <button>Sign Up</button>
                </form>
                <p>Do you have an account? Login
                </p>
            </div>
        </div>
    )
}

export default Register