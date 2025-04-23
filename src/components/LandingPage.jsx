import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import '../styles/animations.css';
import axios from 'axios';

const LandingPage = () => {
    const [showSignIn, setShowSignIn] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleButtonClick = () => {
        setShowSignIn(true);
    };

    const handleLoginClick = async (e) => {
        e.preventDefault();
        const apiUrl = import.meta.env.VITE_USER_DB_LINK;
        const requestBody = {
            username: username,
            password: password
        };
        const requestConfig = {
            headers: {
                'x-api-key': import.meta.env.VITE_USER_DB_KEY
            }
        };
        axios.post(`${apiUrl}/login`, requestBody, requestConfig).then(response => {
            console.log(response.data); // Handle successful login response here
            localStorage.setItem('token', response.data.token); // Store the token in local storage
            localStorage.setItem('user', JSON.stringify(response.data.user)); // Store the user data in local storage
            navigate('/investor'); // Redirect to the investor page after successful registration
        }).catch((error) => {
            setMessage(error.response.data.message);

        });
    }
    return (
        <div className="flex justify-center items-center h-screen bg-gray-900">
            <div
                className={`transition-opacity duration-500 ease-in-out ${
                    showSignIn ? 'opacity-0 pointer-events-none' : 'opacity-100'
                } absolute`}
            >
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-5">Investor</h1>
                    <button
                        className="text-xl font-semibold text-white border-2 border-emerald-500 rounded-lg px-6 py-2 hover:bg-emerald-500 hover:text-gray-900 transition-all duration-300 ease-in-out"
                        onClick={handleButtonClick}
                    >
                        Sign In
                    </button>
                </div>
            </div>

            <div
                className={`transition-opacity duration-500 ease-in-out ${
                    showSignIn ? 'opacity-100' : 'opacity-0 pointer-events-none'
                } absolute`}
            >
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-white">Log In</h2>
                    <div className="flex flex-col justify-center items-center text-center">
                        <form className="flex flex-col justify-center items-center text-center" onSubmit={handleLoginClick} >
                       <input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="border border-emerald-300 rounded-lg px-4 py-2 mt-4 transition-all duration-300 ease-in-out focus:outline-none focus:ring focus:ring-emerald-500"
                            placeholder="Username"
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border border-emerald-300 rounded-lg px-4 py-2 mt-4 transition-all duration-300 ease-in-out focus:outline-none focus:ring focus:ring-emerald-500"
                            placeholder="Password"
                        />
                        {message && (
                            <p className="text-red-500 mt-2 text-sm">
                            {message}
                            </p>
                        )}
                        <button type="submit" 
                            className="text-xl font-semibold text-white border-2 border-emerald-500 rounded-lg px-4 py-1 mt-4 hover:bg-emerald-500 hover:text-gray-900 transition-all duration-300 ease-in-out">
                            Sign In
                        </button>
                        </form>
                        <Link to ="/forgot-password" className="text-emerald-500 mt-4 hover:underline">
                            Forgot Password?
                        </Link>
                        <Link to="/register" className="text-emerald-500 mt-4 hover:underline">
                            Create an Account
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default LandingPage;