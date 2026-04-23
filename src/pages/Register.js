import React, { useState } from 'react';
import axios from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/register', formData);
            alert('Registration Successful!');
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.msg || 'Duplicate email registration'); // Requirement 3b.2
        }
    };

    return (
        <div>
            <h2>Student Registration</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Name" onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                <input type="email" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                <input type="password" placeholder="Password" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;