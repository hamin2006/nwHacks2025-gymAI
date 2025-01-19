import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/LoginPage.css';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle login logic here
        setMessage('Login successful!');
        navigate('/homepage');
    };

    return (
        <div className="login-container">
            <h1 className="gym-ai-title">RepWise</h1>
            <div className="login-box">
                <h1 className="login-title">Login</h1>
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Enter your username"
                            className="input-field"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
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
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="login-button">
                        Login
                    </button>
                </form>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
};

export default LoginPage;