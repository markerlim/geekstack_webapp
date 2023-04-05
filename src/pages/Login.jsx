import React, { useState } from "react";
import { useNavigate, Link} from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const Login = () => {
    const [err,setErr] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e)=>{
        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;

        try{
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/login")
        } catch (err) {
            setErr(true);
        }
    };
    return(
        <div className="formContainer">
            <div className="formWrapper">
                <span className="logo">GEEK STACK</span>
                <span className="title">Login</span>
                <form onSubmit={handleSubmit}>
                    <input type="email" placeholder="Email"/>
                    <input type="password" placeholder="Password"/>
                    <button>Login</button>
                    {err && <span>something went wrong</span>}
                </form>
                <p>Don't have an account? <Link to="/register">Register</Link></p>
            </div>
        </div>
    )
}

export default Login