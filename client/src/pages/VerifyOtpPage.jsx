import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import image from "../assets/image.png";

const VerifyOtpPage = () => {
    const [otp, setOtp] = useState(Array(6).fill(""));
    const [error, setError] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [otpResendTimer, setOtpResendTimer] = useState(30);
    const inputRefs = useRef([]);
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(useLocation().search);

    // Get parameters from URL
    const email = queryParams.get("email");
    const bookingId = queryParams.get("bookingId");
    const type = queryParams.get("type") || "auth"; // "auth" or "cancel"

    // Define API endpoint and redirection dynamically
    const apiEndpoint = type === "cancel" ? "/verify-cancel-booking" : "/verify-otp";
    const redirectTo = type === "cancel" ? "/account/bookings?refresh=true" : "/login";
    const pageTitle = type === "cancel" ? "Confirm Booking Cancellation" : "OTP Verification";
    const buttonText = type === "cancel" ? "Verify OTP & Cancel Booking" : "Verify OTP";

    // Start resend OTP timer
    useEffect(() => {
        if (otpResendTimer > 0) {
            const timer = setInterval(() => {
                setOtpResendTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [otpResendTimer]);

    //  Function to verify OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setIsVerifying(true);
        setError("");

        try {
            const payload = { email, otp: otp.join("") };
            if (type === "cancel") payload.bookingId = bookingId;

            const response = await axios.post(apiEndpoint, payload);
            console.log(response, apiEndpoint, redirectTo)
            alert(response.data.message);
            navigate(redirectTo);
        } catch (error) {
            setError(error.response?.data?.message || "Verification failed. Try again.");
        } finally {
            setIsVerifying(false);
        }
    };

    // Handle OTP input change
    const handleChange = (e, index) => {
        const value = e.target.value;
        if (!isNaN(value) && value.length <= 1) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            
            if (value && index < otp.length - 1) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };


    // Handle Backspace
    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            const newOtp = [...otp];
            newOtp[index - 1] = "";  
            setOtp(newOtp);
            inputRefs.current[index - 1]?.focus();  
        }
    };


    //  Function to resend OTP
    const resendOtp = async () => {
        try {
            setError("");
            setOtp(Array(6).fill(""));
            setOtpResendTimer(30);

            await axios.post(type === "cancel" ? "/resend-cancel-otp" : "/resend-otp", { email, bookingId });
        } catch (error) {
            setError("Failed to resend OTP. Try again.");
        }
    };

    return (
        <div className="flex items-center justify-center mt-20">
            <div className="bg-white shadow-lg rounded-lg p-6 w-96 border">
                <div className="flex justify-center mb-4">
                    <img src={image} alt="OTP Verification" className="h-12 w-12" />
                </div>
                <h1 className="text-2xl font-bold text-center mb-4">{pageTitle}</h1>
                <p className="text-center text-gray-500 mb-4">
                    Enter the OTP sent to <strong>{email}</strong>
                </p>

                <form onSubmit={handleVerifyOtp}>
                    <div className="flex justify-center gap-2 mb-4">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                maxLength="1"
                                className="border border-gray-300 rounded text-center w-10 h-10"
                                value={digit}
                                onChange={(e) => handleChange(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}  
                            />
                        ))}
                    </div>
                    {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}
                    <button
                        className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                        disabled={isVerifying}
                    >
                        {isVerifying ? "Verifying..." : buttonText}
                    </button>
                    <p className="text-gray-500 text-center mt-4">Resend OTP in {otpResendTimer}s</p>
                    {otpResendTimer === 0 && (
                        <p className="text-blue-600 text-center mt-4 cursor-pointer" onClick={resendOtp}>
                            Resend OTP
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
};

export default VerifyOtpPage;
