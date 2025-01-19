import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/LoginPage.css"; // Importing the CSS file

const LoginPage = () => {
    const navigate = useNavigate();

    const handleLogin = (event) => {
        
        navigate("homepage.jsx"); 
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1 className="login-title">Login</h1>
                <form className="login-form" onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your username"
                            className="input-field"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            className="input-field"
                        />
                    </div>
                    <button type="submit" className="login-button">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
