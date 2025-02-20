import { Link, Navigate } from "react-router-dom";
import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../contexts/UserContext";

export default function LoginPage() {


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const [loginType, setLoginType] = useState('user');
    const { user, setUser } = useContext(UserContext);
    const [errors, setErrors] = useState({});
    const [generalError, setGeneralError] = useState('');

    if(user){
        return <Navigate to={'/'} />
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function validateForm() {
        const newErrors = {};
        if (!email) newErrors.email = "Email is required.";
        else if (!emailRegex.test(email)) newErrors.email = "Invalid email.";
        if (!password) newErrors.password = "Password is required.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    async function handleLoginSubmit(ev) {
        ev.preventDefault();
        if (!validateForm()) return;

        try {
            const { data } = await axios.post('/login', { email, password, loginType });
            setUser(data);
            alert('Login successful');
            setRedirect(true);
        } catch (e) {
            
            const errorMessage = e.response?.data?.message || 'An error occurred. Please try again.';
            setGeneralError(errorMessage);
        }
    }

    if (redirect) {
        return <Navigate to={loginType === 'admin' ? '/admin' : '/'} />;
    }

    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64">
                <h1 className="text-4xl text-center mb-4">{`${loginType.charAt(0).toUpperCase() + loginType.slice(1)} Login`}</h1>

                <form className="max-w-md mx-auto" onSubmit={handleLoginSubmit}>
                    <div className="flex justify-center space-x-4 mb-4">
                        {['user', 'villa owner', 'admin'].map(type => (
                            <label key={type}>
                                <input
                                    type="radio"
                                    name="loginType"
                                    value={type}
                                    checked={loginType === type}
                                    onChange={() => setLoginType(type)}
                                />
                                {`${type.charAt(0).toUpperCase() + type.slice(1)} Login`}
                            </label>
                        ))}
                    </div>

                    <div className="mb-4">
                        <input
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={ev => setEmail(ev.target.value)}
                            className="border p-2 w-full"
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>

                    <div className="mb-4">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={ev => setPassword(ev.target.value)}
                            className="border p-2 w-full"
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                    </div>

                    {/* Display general error */}
                    {generalError && <p className="text-red-500 text-sm">{generalError}</p>}

                    <button className="primary">Login</button>

                    <div className="text-center py-2 text-gray-500">
                        Don't have an account? <Link className="underline text-black" to='/register'>Register now</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
