import AccountNav from "../components/AccountNav.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import PlaceImg from "../components/PlaceImg.jsx";
import { Link, useNavigate } from "react-router-dom";
import BookingDates from "../components/BookingDates.jsx";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/bookings').then(response => {
      setBookings(response.data);
    });
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get("refresh")) {
      axios.get("/bookings").then((response) => {
        setBookings(response.data); 
      });
    }
  }, [location.search]);

  const requestCancelBooking = async (bookingId) => {
    try {
      const response = await axios.post("/request-cancel-booking", { bookingId });
      if (response.status === 200) {
        alert("OTP sent to your email");
        navigate(`/verify-otp?bookingId=${bookingId}&type=cancel`);
      }
    } catch (error) {
      alert("Error sending OTP. Try again.");
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <AccountNav />
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 lg:px-16 mt-8">
        {bookings?.length > 0 ? (
          bookings.map(booking => (
            <div key={booking._id} className="flex flex-col md:flex-row gap-6 bg-gray-200 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out overflow-hidden mb-6">
              <div className="w-full md:w-48">
                <PlaceImg place={booking.place} className="w-full h-full object-cover rounded-t-xl md:rounded-l-xl" />
              </div>
              <div className="py-4 pr-6 grow flex flex-col justify-between">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">{booking.place.title}</h2>
                <BookingDates booking={booking} className="text-sm text-gray-500 mb-4" />
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                  </svg>
                  <span className="text-lg md:text-xl font-medium text-gray-800">
                    Total price: ₹{booking.price}
                  </span>
                </div>
                <button onClick={() => requestCancelBooking(booking._id)} className="mt-4 bg-red-600 text-white py-2 px-4 rounded-md">
                  Cancel Booking
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-xl text-gray-500">No bookings found</p>
        )}
      </div>
    </div>
  );
}
