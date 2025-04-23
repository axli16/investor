import React from 'react';
import axios from 'axios';
import { useState } from 'react';

const ForgotPassword = () => {
    const [input, setInput] = useState('');
    const [message, setMessage] = useState('');

    //only accepts usernames, emails can be used for multiple users, like riot games and their account managmenet system
    const sendResetLink = (e) => {
        e.preventDefault();

        const apiUrl = import.meta.env.VITE_USER_DB_LINK;
        const requestConfig = {
            headers: {
                'x-api-key': import.meta.env.VITE_USER_DB_KEY
            }
        };
        
        axios.get(`${apiUrl}/email?username=${input}`,requestConfig).then(response => {
            console.log(response.data);
            setMessage('Reset link sent to your email.');
        }).catch((error) => {
            if (error.response.status === 404) {
                setMessage('Invalid username.');
            }else if (error.response.status === 502){
                setMessage('Invalid username.');
            }
        });

    }

    return (
        <div className="flex justify-center items-center h-screen bg-gray-900">
            <button
                onClick={() => window.history.back()}
                className="absolute top-5 left-5 text-white font-semibold border border-white rounded px-3 py-1 hover:bg-white hover:text-gray-900 transition"
            >
                ← Back
            </button>
            <div className="text-center">
                <h1 className="text-4xl font-bold text-white mb-5">Forgot Password</h1>
                <form className="flex flex-col justify-center items-center text-center" onSubmit={sendResetLink}>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="border border-emerald-300 rounded-lg px-4 py-2 mt-4 transition-all duration-300 ease-in-out focus:outline-none focus:ring focus:ring-emerald-500"
                    placeholder="Username"
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
                    Reset
                </button>
                </form>
                
            </div>
        </div>
    );
}

export default ForgotPassword;