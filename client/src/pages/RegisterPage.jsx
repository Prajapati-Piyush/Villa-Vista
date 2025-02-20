import { useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user'); 
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState(""); 

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/; 

    function validateForm() {
        const newErrors = {};
        setServerError(""); 

        if (!name.trim()) {
            newErrors.name = "Name is required.";
        } else if (name.trim().length < 3) {
            newErrors.name = "Name must be at least 3 characters long.";
        }

        if (!email.trim()) {
            newErrors.email = "Email is required.";
        } else if (!emailRegex.test(email.trim())) {
            newErrors.email = "Enter a valid email address.";
        }

        if (!password) {
            newErrors.password = "Password is required.";
        } else if (!passwordRegex.test(password)) {
            newErrors.password = "Password must have 6+ chars, 1 uppercase, 1 number, 1 special character.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    async function registerUser(ev) {
        ev.preventDefault();
        if (!validateForm()) return;

        try {
            await axios.post('/register', {
                name: name.trim(),
                email: email.trim(),
                password,
                role: role.toLowerCase(), 
            });
            alert('Registration successful. Now you can log in');
        } catch (error) {
            if (error.response && error.response.data) {
                setServerError(error.response.data.message || "Something went wrong. Please try again.");
            } else {
                setServerError("Server error. Please try again later.");
            }
        }
    }

    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64">
                <h1 className="text-4xl text-center mb-4">Register</h1>
                <form className="max-w-md mx-auto" onSubmit={registerUser}>
                    <input 
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={ev => setName(ev.target.value)} 
                        className={`border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 w-full`}
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

                    <input 
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={ev => setEmail(ev.target.value)} 
                        className={`border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 w-full`}
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

                    <input 
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={ev => setPassword(ev.target.value)} 
                        className={`border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 w-full`}
                    />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

                    {/* Add a dropdown for role selection */}
                    <select 
                        value={role}
                        onChange={ev => setRole(ev.target.value)} 
                        className="border  border-gray-300 rounded px-3 py-2 w-full mt-4"
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="villa">Villa</option>
                    </select>

                    {/* Server-side error messages */}
                    {serverError && <p className="text-red-500 text-sm mt-2">{serverError}</p>}

                    <button className="primary w-full mt-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                        Register
                    </button>

                    <div className="text-center py-2 text-gray-500">
                        Already a member? <Link className="underline text-black" to={'/login'}>Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
