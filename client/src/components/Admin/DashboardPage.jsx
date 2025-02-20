import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../../contexts/UserContext';

const DashboardPage = () => {
    const [stats, setStats] = useState({
        totalVillas: 0,
        totalBookings: 0,
        totalUsers: 0,
        totalEarnings: 0,
    });
    const [recentBookings, setRecentBookings] = useState([]);

    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                if (user.role === 'admin') {
                    const response = await axios.get('/admin/stats');
                    setStats(response.data);
                } 
                else if (user.role === 'villa owner') {
                    const response = await axios.get('/villa-owner/stats');
                    console.log(response.data);
                    setStats(response.data);
                } 
                }
             catch (error) {
                console.error('Error fetching stats', error);
            }
        };


        fetchStats();
    }, [user.role]);

    useEffect(() => {
        const fetchRecentBookings = async () => {
            try {
                let url = '/bookings/recent';

                if (user.role === 'villa owner') {
                    // url = '/user-bookings';  
                    url = `/owner-bookings?type=recent`;
                }

                const response = await axios.get(url);
                setRecentBookings(response.data);
            } catch (error) {
                console.error('Error fetching recent bookings', error);
            }
        };

        fetchRecentBookings();
    }, [user.role]);

    return (
        <div className="p-6">
            {/* Display stats for both roles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-blue-500 text-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-lg font-medium">Total Villas</h3>
                    <p className="text-2xl">{stats.totalVillas}</p>
                </div>
                <div className="bg-green-500 text-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-lg font-medium">Total Bookings</h3>
                    <p className="text-2xl">{stats.totalBookings}</p>
                </div>
                <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-lg font-medium">Total Users</h3>
                    <p className="text-2xl">{stats.totalUsers}</p>
                </div>
                <div className="bg-purple-500 text-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-lg font-medium">Total Earnings</h3>
                    <p className="text-2xl">${stats.totalEarnings}</p>
                </div>
            </div>

            {/* Display recent bookings for both roles */}
            <div>
                <h2 className="text-xl font-semibold mb-4">{user.role === 'admin' ? 'All Recent Bookings' : 'Recent Bookings for Your Villas'}</h2>
                {recentBookings.length === 0 ? (
                    <p>No recent bookings found.</p>
                ) : (
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
                            {recentBookings.map((booking) => (
                                <tr key={booking.id}>
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
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
