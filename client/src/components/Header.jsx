import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function Header() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <header className="bg-gray-100 py-4 px-6 shadow-md flex justify-between items-center">
      {/* Left side: Logo */}
      <div className="flex items-center">
        <Link to="/">
          <p className="text-gray-800 text-2xl font-semibold tracking-wide hover:text-blue-500 transition duration-200">
            DRIEMS
          </p>
        </Link>
      </div>

      {/* Right side: Buttons */}
      <div className="flex items-center space-x-4">
        {currentUser ? (
          <>
            <p className="text-gray-600 text-lg">Hello, {currentUser.name}</p>
            <button className="text-white bg-blue-500 hover:bg-blue-400 px-5 py-2 rounded-md transition duration-200">
              Sign Out
            </button>
          </>
        ) : (
          <div className="flex space-x-4">
            <Link to="/signup">
              <button className="text-white bg-blue-500 hover:bg-blue-400 px-5 py-2 rounded-md transition duration-200">
                Sign Up
              </button>
            </Link>
            <Link to="/login">
              <button className="text-white bg-blue-500 hover:bg-blue-400 px-5 py-2 rounded-md transition duration-200">
                Log In
              </button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
