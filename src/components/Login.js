import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                // Redirect user to the home page
                window.location.href = '/home';
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Login failed!');
            console.error('Login error:', error.response?.data?.message || error.message);
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleLoginSubmit}>
                <h2>Login</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <p>Don't have an account? <a href="/signup">Sign Up</a></p>
            </form>
        </div>
    );
};

export default Login;
