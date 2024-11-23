// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TodoHome from './components/TodoHome';
import Login from './components/Login';
import Signup from './components/Signup';

// A private route component to protect the TodoHome page
const PrivateRoute = ({ children }) => {
    return localStorage.getItem('token') ? children : <Navigate to="/login" />;
};

const App = () => {
    return (
        <Router>
            <div className="App">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    {/* Private Route */}
                    <Route path="/home" element={<PrivateRoute><TodoHome /></PrivateRoute>} />

                    {/* Redirect unknown routes to login */}
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
