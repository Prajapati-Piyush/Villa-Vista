import React, { useContext } from 'react';
import logo from '../assets/logo.svg';
import { Link } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

const Header = ({ searchInput, handleQueryChange }) => {
  const { user } = useContext(UserContext);

  // Determine the link based on user role
  const accountLink = user ? (user.role === 'admin' ? '/admin' : '/account') : '/login';

  return (
    <div>
      <header className='flex flex-col md:flex-row justify-between items-center md:space-x-8 space-y-4 md:space-y-0 p-4'>
        {/* Logo */}
        <Link to={'/'} className='flex items-center gap-1'>
          <img src={logo} alt="" className='h-12 w-12' />
          <span className='font-bold text-3xl text-'>VillVista</span>
        </Link>

        {/* Search Bar */}
        <div className="relative w-full max-w-lg">
          <input
            type="text"
            value={searchInput}
            onChange={handleQueryChange}
            placeholder="Search by any title or location"
            className="w-full py-3 px-5 border border-gray-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
            style={{ borderRadius: '50px' }}
          />
        </div>

        {/* Account Button */}
        <Link to={accountLink} className="flex gap-2 border border-gray-300 rounded-full py-2 px-4 shadow-md shadow-gray-300 w-full md:w-auto justify-center items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
          <div className="bg-gray-500 text-white rounded-full border border-gray-500 overflow-hidden">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 relative top-1">
              <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
            </svg>
          </div>
          {!!user && (
            <div className="hidden md:block">
              {user.name}
            </div>
          )}
        </Link>
      </header>
    </div>
  );
};

export default Header;
