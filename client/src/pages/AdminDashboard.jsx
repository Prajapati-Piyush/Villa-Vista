import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Admin/Sidebar';
import Header from '../components/Admin/Header';
import DashboardPage from '../components/Admin/DashboardPage';
import VillasPage from '../components/Admin/VillasPage';
import BookingPage from '../components/Admin/BookingPage';
import UsersPage from '../components/Admin/UsersPage';
import PlacesFormPage from './PlacesFormPage';
import Feedbacks from '../components/Admin/Feedbacks';

const AdminDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-8">
        <Header />

        <Routes>
          <Route path="/" element={<DashboardPage />} /> 
        
          <Route path="/villas" element={<VillasPage />} />
          <Route path="/bookings" element={<BookingPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/feedbacks" element={<Feedbacks />} />
          <Route path="/places/:id" element={<PlacesFormPage />} />

        </Routes>
      </div>
    </div>

  );
};

export default AdminDashboard;
