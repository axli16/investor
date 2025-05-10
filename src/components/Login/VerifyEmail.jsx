import React, { use } from 'react';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VerifyEmail = () => {

    const [message, setMessage] = useState('Verifying user...');
    const navigate = useNavigate();

    useEffect(() => {
        const token = new URLSearchParams(window.location.search).get('token');
        const apiUrl = import.meta.env.VITE_USER_DB_LINK;
        const requestConfig = {
            headers: {
                'x-api-key': import.meta.env.VITE_USER_DB_KEY
            }
        };
        const requestBody = {
            username: username,
            token: token,
            type: 'verify'
        };
        

    })
    return(
        <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-5">{message}</h1>
        </div>
    </div>
    )
}

// export default VerifyEmail;

//not implemented yet, and not used anywhere in the app yet. 
//email componenet will not be implemented 
//this file is only here for future reference.