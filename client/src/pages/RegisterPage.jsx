import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);  // Manage password visibility
    const navigate = useNavigate();

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
        setServerError("")

        try {
            const response = await axios.post('/register', {
                name: name.trim(),
                email: email.trim(),
                password,
                role: role.toLowerCase(),
            });

            if (response.data.message) {
                setOtpSent(true);
                
                setTimeout(() => {
                    navigate(`/verify-otp?email=${email.trim()}`);
                }, 5000);
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setServerError(error.response.data.message || "Something went wrong. Please try again.");
            } else {
                setServerError("Server error. Please try again later.");
            }
        }
    }

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

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

                    <div className="relative">
                        <input
                            type={passwordVisible ? "text" : "password"}  // Toggle password visibility
                            placeholder="Password"
                            value={password}
                            onChange={ev => setPassword(ev.target.value)}
                            className={`border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 w-full`}
                        />
                        {/* Eye Icon to toggle password visibility */}
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                            {passwordVisible ? (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4 rounded-4xl">
                                    <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                                    <path fillRule="evenodd" d="M1.38 8.28a.87.87 0 0 1 0-.566 7.003 7.003 0 0 1 13.238.006.87.87 0 0 1 0 .566A7.003 7.003 0 0 1 1.379 8.28ZM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" clipRule="evenodd" />
                                </svg>

                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4 bg-none">
                                    <path fillRule="evenodd" d="M3.28 2.22a.75.75 0 0 0-1.06 1.06l10.5 10.5a.75.75 0 1 0 1.06-1.06l-1.322-1.323a7.012 7.012 0 0 0 2.16-3.11.87.87 0 0 0 0-.567A7.003 7.003 0 0 0 4.82 3.76l-1.54-1.54Zm3.196 3.195 1.135 1.136A1.502 1.502 0 0 1 9.45 8.389l1.136 1.135a3 3 0 0 0-4.109-4.109Z" clipRule="evenodd" />
                                    <path d="m7.812 10.994 1.816 1.816A7.003 7.003 0 0 1 1.38 8.28a.87.87 0 0 1 0-.566 6.985 6.985 0 0 1 1.113-2.039l2.513 2.513a3 3 0 0 0 2.806 2.806Z" />
                                </svg>

                            )}
                        </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

                    <select
                        value={role}
                        onChange={ev => setRole(ev.target.value)}
                        className="border  border-gray-300 rounded px-3 py-2 w-full mt-4"
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="villa owner">Villa Owner</option>
                    </select>

                    {serverError && <p className="text-red-500 text-sm mt-2">{serverError}</p>}

                    <button className="primary w-full mt-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                        Register
                    </button>

                    {otpSent && <p className="text-green-500 text-sm mt-4">OTP sent to your email. Please verify.</p>}

                    <div className="text-center py-2 text-gray-500">
                        Already a member? <Link className="underline text-black" to={'/login'}>Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
