import React, { useState } from 'react';
import Header from '../components/Header';
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';

const Layout = () => {
  const [searchInput, setSearchInput] = useState("");

  const handleQueryChange = (event) => {
    setSearchInput(event.target.value);
  };

  return (
    <div className=' pt-3 flex flex-col min-h-screen'>
      <div className="px-4">
      <Header searchInput={searchInput} handleQueryChange={handleQueryChange} />
      <Outlet className='px-4' context={{ searchInput }} /> {/* Passing searchInput to child components */}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
