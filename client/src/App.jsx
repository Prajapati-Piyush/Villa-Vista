import { Route, Routes } from 'react-router-dom'
import './App.css'
import IndexPage from './pages/IndexPage'
import LoginPage from './pages/LoginPage'
import "react-datepicker/dist/react-datepicker.css";

import Layout from './pages/Layout'
import RegisterPage from './pages/RegisterPage'
import axios from 'axios'
import { UserContextProvider } from './contexts/UserContext'
import ProfilePage from './pages/ProfilePage'
import PlacesPage from './pages/PlacesPage'
import PlacesFormPage from './pages/PlacesFormPage'
import PlacePage from './pages/PlacePage'
import BookingsPage from './pages/BookingsPage'
import BookingPage from './pages/BookingPage'
import FeedbackPage from './pages/FeedbackPage'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import VerifyOtpPage from './pages/VerifyOtpPage'

axios.defaults.baseURL = import.meta.env.MODE === "development" ? 'http://localhost:3000' : "https://villa-vista-backend.onrender.com";
axios.defaults.withCredentials = true;


function App() {
  return (

    <UserContextProvider >

      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/verify-otp' element={<VerifyOtpPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/account" element={<ProfilePage />} />
          <Route path="/account/places" element={<PlacesPage />} />
          <Route path="/account/places/new" element={<PlacesFormPage />} />
          <Route path="/account/places/:id" element={<PlacesFormPage />} />
          <Route path="/place/:id" element={<PlacePage />} />
          <Route path='/account/bookings' element={<BookingsPage />} />
          <Route path='/account/bookings/:id' element={<BookingPage />} />

          <Route path='/account/feedback' element={<FeedbackPage />} />
        </Route>
        <Route path='/admin/*' element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />


      </Routes>
    </UserContextProvider>
  )
}

export default App
