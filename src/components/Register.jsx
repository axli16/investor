import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/animations.css';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {

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
        const requestBody = {
            username: username,
            email: email,
            password: password,
            type: 'register'
        };
        
        axios.post(`${apiUrl}/register`, requestBody, requestConfig).then(response => {
            console.log(response.data); // Handle successful login response here
            axios.post(`${apiUrl}/email`, requestBody, requestConfig).then(response => {
                console.log(response.data); // Handle successful login response here
                setMessage('Registration successful. Please check your email for verification.');
            }).catch((error) => {
                setMessage(error.response.data.message);
            });
        }).catch((error) => {
            setMessage(error.response.data.message);
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
                <h1 className="text-4xl font-bold text-white mb-5">Investor</h1>
                <h2 className="text-4xl font-bold text-white mb-5">Create an Account</h2>
                    <form className="flex flex-col justify-center items-center text-center" onSubmit={handleRegister}>
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border border-emerald-300 rounded-lg px-4 py-2 mt-4 transition-all duration-300 ease-in-out focus:outline-none focus:ring focus:ring-emerald-500"
                        placeholder="Email"
                    />
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
                        type="submit"
                        className="text-xl font-semibold text-white border-2 border-emerald-500 rounded-lg px-4 py-1 mt-4 hover:bg-emerald-500 hover:text-gray-900 transition-all duration-300 ease-in-out"
                    >
                        Register
                    </button>
                    </form>
            </div>
        </div>
    );
};

export default Register;