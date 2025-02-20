// components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { useContext, useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

const Header = () => {
  const {setUser } = useContext(UserContext);
  const [redirect, setRedirect] = useState(null);

  async function logout() {
    await axios.post('/logout');
    setRedirect('/');
    setUser(null);
  }
  if (redirect) {
    return <Navigate to={redirect} />
  }

  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <div className="flex items-center space-x-4">
        <button
          onClick={logout}
          className="bg-gray-400 font-medium text-[17px] rounded-3xl px-5 py-2 flex gap-2 
                          items-center justify-center hover:scale-105 transition-all sm:px-6"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
            />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;
