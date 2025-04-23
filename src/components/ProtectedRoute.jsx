import React from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');

    // Check if the token exists in local storage
    // If it doesn't exist, redirect to the landing page
    const apiUrl = import.meta.env.VITE_USER_DB_LINK;

    const requestConfig = {
        headers: {
            'x-api-key': import.meta.env.VITE_USER_DB_KEY
        }
    };
    const requestBody = {
        username: JSON.parse(localStorage.getItem('user')).username,
        token: token,
        type: 'verify'
    };
    //call the verify endpoint to check if the token is valid
    // If the token is valid, allow access to the protected route
    axios.post(`${apiUrl}/verify`, requestBody, requestConfig).then(response => {
        console.log(response.data); // Handle successful login response here
    }).catch((error) => {
        if (error.response.status === 401) {
            console.log('Invalid token or username.');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    });
    // Check the credentials in local storage again? Honeslty it was generated, and it doesn't work if I try to set a variable inside the axios call, so for now it will work.
    const user = JSON.parse(localStorage.getItem('user'));
    const isLoggedIn = !!token && !!user;

    return isLoggedIn ? children : <Navigate to="/" />;
}
export default ProtectedRoute;

