import { useContext, useEffect, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import DatePicker from "react-datepicker";
import logo from "../assets/logo.svg";



export default function BookingWidget({ place }) {
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [numberOfGuests, setNumberOfGuests] = useState(1);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [redirect, setRedirect] = useState('');
    const [error, setError] = useState('');
    const { user } = useContext(UserContext);
    const [bookedDates, setBookedDates] = useState([]);
    if (!place) {
        return <div>Loading...</div>;
    }
    

    useEffect(() => {
        if (user) {
            setName(user.name);
        }
        (async () => {
            await fetchBookedDates();
        })();
    }, [user, place]);

    async function fetchBookedDates() {
        try {
            const response = await axios.get(`/bookings/${place._id}`);
            setBookedDates(response.data.map(date => new Date(date)));
        } catch (error) {
            console.error("Error fetching booked dates:", error);
        }
    }

    let numberOfNights = 0;
    if (checkIn && checkOut) {
        numberOfNights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
    }

    function validateForm() {
        const today = new Date().toISOString().split('T')[0];

        if (!checkIn || !checkOut) {
            setError("Both check-in and check-out dates are required.");
            return false;
        }
        if (new Date(checkIn) < new Date(today)) {
            setError("Check-in date cannot be in the past.");
            return false;
        }
        if (new Date(checkOut) < new Date(today)) {
            setError("Check-out date cannot be in the past.");
            return false;
        }
        if (new Date(checkIn) >= new Date(checkOut)) {
            setError("Check-out date must be after the check-in date.");
            return false;
        }
        if (numberOfGuests <= 0) {
            setError("Number of guests must be at least 1.");
            return false;
        }
        if (numberOfGuests > place.maxGuests) {
            setError(`Number of guests cannot exceed ${place.maxGuests}.`);
            return false;
        }
        if (!name) {
            setError("Please enter your full name.");
            return false;
        }
        const phoneRegex = /^[0-9]{10}$/;
        if (!phone || !phoneRegex.test(phone)) {
            setError("Please enter a valid 10-digit phone number.");
            return false;
        }
        if (!user) {
            setError("You must be logged in to book this place.");
            return false;
        }
        setError('');
        return true;
    }

    async function handlePayment() {
        if (!validateForm()) {
            return;
        }

        if (user.role !== 'user') {
            setError("Only users can book places.");
            return false;
        }

        try {
            const { data } = await axios.post('/create-order', {
                amount: numberOfNights * place.price
            });

            if (!data || !data.id) {
                alert("Error creating order. Please try again.");
                return;
            }

            console.log("Opening Razorpay Payment Modal, Order ID:", data.id);

            if (!window.Razorpay) {
                alert("Razorpay SDK not loaded. Please check your script import.");
                return;
            }

            const options = {
                key: "rzp_test_satWDFf0xrQ5Ys",
                amount: data.amount,
                currency: "INR",
                name: "Villa Vista",
                description: "Payment for Villa",
                order_id: data.id,
                image:logo,
                handler: async function (response) {
                    console.log("Payment Successful!", response);

                    const res = await axios.post("/bookings", {
                        checkIn, checkOut, numberOfGuests, name, phone,
                        place: place._id,
                        price: numberOfNights * place.price,
                        paymentId: response.razorpay_payment_id
                    });

                    console.log("Booking response:", res.data);
                    const bookingId = res.data._id;
                    setRedirect(`/account/bookings/${bookingId}`);
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                    contact: phone
                },
                theme: {
                    color: "#252d7e",  // 🔥 Custom Theme Color
                    backdrop_color: "#f5f5f8"
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (error) {
            console.error("Payment Error:", error);
            alert("Payment Failed! Try Again.");
        }
    }


    if (redirect) {
        return <Navigate to={redirect} />;
    }


    function highlightBookedDates(date) {
        return bookedDates.some(
            bookedDate => bookedDate.toDateString() === date.toDateString()
        ) ? "booked-date" : "";
    }

    return (
        <div className="bg-white shadow p-4 rounded-2xl">
            <div className="text-2xl text-center">
                Price: ₹{place.price} / per night
            </div>
            {error && (
                <div className="text-red-500 text-center my-2">
                    {error}
                </div>
            )}
            <div className="border rounded-2xl mt-4">
                <div className="flex">
                    <div className="py-3 px-4">
                        <label>Check in:</label>
                        <DatePicker
                            selected={checkIn}
                            onChange={date => setCheckIn(date)}
                            minDate={new Date()}
                            excludeDates={bookedDates}
                            dateFormat="yyyy-MM-dd"
                            className="w-full p-2 border rounded"
                            dayClassName={highlightBookedDates}
                        />
                    </div>
                    <div className="py-3 px-4 border-l">
                        <label>Check out:</label>
                        <DatePicker
                            selected={checkOut}
                            onChange={date => setCheckOut(date)}
                            minDate={checkIn || new Date()}
                            excludeDates={bookedDates}
                            dateFormat="yyyy-MM-dd"
                            className="w-full p-2 border rounded"
                            dayClassName={highlightBookedDates}
                        />
                    </div>
                </div>
                <div className="py-3 px-4 border-t">
                    <label>Number of guests:</label>
                    <input
                        type="number"
                        value={numberOfGuests}
                        onChange={ev => setNumberOfGuests(Math.min(ev.target.value, place.maxGuests))}
                        min="1"
                        max={place.maxGuests}
                    />
                    <p className="text-sm text-gray-600 mt-1">
                        Max guests: {place.maxGuests}
                    </p>
                </div>
                {numberOfNights > 0 && (
                    <div className="py-3 px-4 border-t">
                        <label>Your full name:</label>
                        <input type="text"
                            value={name}
                            onChange={ev => setName(ev.target.value)} />
                        <label>Phone number:</label>
                        <input type="tel"
                            value={phone}
                            onChange={ev => setPhone(ev.target.value)} />
                    </div>
                )}
            </div>

            <button onClick={handlePayment} className="primary mt-4">
                Pay & Book ₹{numberOfNights * place.price}
            </button>
        </div>
    );
}
