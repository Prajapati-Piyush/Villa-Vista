import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../contexts/UserContext';

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        if (user.role === 'admin') {
          const { data } = await axios.get('/all-bookings');
          setBookings(data);
        }
        else if (user.role === 'villa owner') {
          const { data } = await axios.get('/owner-bookings');
          setBookings(data);

        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Bookings</h2>
      <table className="min-w-full table-auto bg-white shadow-md rounded-lg">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Booking ID</th>
            <th className="px-4 py-2 text-left">Villa</th>
            <th className="px-4 py-2 text-left">User</th>
            <th className="px-4 py-2 text-left">Phone</th>
            <th className="px-4 py-2 text-left">CheckIn</th>
            <th className="px-4 py-2 text-left">CheckOut</th>
            <th className="px-4 py-2 text-left">Price</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id}>
             <td className="px-4 py-2">{booking.id}</td>
              <td className="px-4 py-2">{booking.villa}</td>
              <td className="px-4 py-2">{booking.user}</td>
              <td className="px-4 py-2">{booking.phone}</td>
              <td className="px-4 py-2">{booking.checkIn}</td>
              <td className="px-4 py-2">{booking.checkOut}</td>
              <td className="px-4 py-2">{booking.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingsPage;
