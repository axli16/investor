import React from 'react';
import axios from 'axios';
import { useState } from 'react';


const ResetPassword = () => {

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const sendResetLink = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }
        const apiUrl = import.meta.env.VITE_USER_DB_LINK;
        const requestConfig = {
            headers: {
                'x-api-key': import.meta.env.VITE_USER_DB_KEY
            }
        };
        const token = new URLSearchParams(window.location.search).get('token');
        const requestBody = {
            password: password,
            token: token
        };
        axios.post(`${apiUrl}/reset-password`, requestBody, requestConfig).then(response => {
            console.log(response.data); // Handle successful login response here
            window.location.href = '/'; // Redirect to the login page after successful registration
        }).catch((error) => {
            if (error.response.status === 401) {
                setMessage('Invalid token or password.');
            }else if (error.response.status === 503){
                setMessage('Service unavailable. Please try again later.');
            }
        });
    }

    return(
        <div className="flex justify-center items-center h-screen bg-gray-900">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-white mb-5">Reset Password</h1>
                <form className="flex flex-col justify-center items-center text-center" onSubmit={sendResetLink}>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border border-emerald-300 rounded-lg px-4 py-2 mt-4 transition-all duration-300 ease-in-out focus:outline-none focus:ring focus:ring-emerald-500"
                    placeholder="Password"
                />
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border border-emerald-300 rounded-lg px-4 py-2 mt-4 transition-all duration-300 ease-in-out focus:outline-none focus:ring focus:ring-emerald-500"
                    placeholder="Confirm Password"
                />
                {message && (
                    <p className="text-red-500 mt-2 text-sm">
                    {message}
                    </p>
                )}
                <button
                    className="text-xl font-semibold text-white border-2 border-emerald-500 rounded-lg px-6 py-2 mt-4 hover:bg-emerald-500 hover:text-gray-900 transition-all duration-300 ease-in-out"
                    type = 'submit'
                >
                    Set Password
                </button>
                </form>
                
            </div>
        </div>
    );
}

export default ResetPassword;