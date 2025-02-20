import React, { useState } from 'react';
import Header from '../components/Header';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  const [searchInput, setSearchInput] = useState("");

  const handleQueryChange = (event) => {
    setSearchInput(event.target.value);
  };

  return (
    <div className='px-4 pt-3 flex flex-col min-h-screen'>
      <Header searchInput={searchInput} handleQueryChange={handleQueryChange} />
      <Outlet context={{ searchInput }} /> {/* Passing searchInput to child components */}
    </div>
  );
};

export default Layout;
