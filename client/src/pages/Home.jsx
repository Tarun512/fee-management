import React from 'react';

function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl text-center bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome to DRIEMS Fee Management System
        </h1>
        <p className="text-lg text-gray-600">
          Please login/ Sign up to continue
        </p>
        <div className='flex flex-row justify-items-center justify-evenly'>
          <div className="mt-6">
            <a
              href="/signup"
              className="inline-block bg-blue-600 text-white text-lg px-6 py-2 rounded-md hover:bg-blue-500 transition duration-200"
            >
              Sign up
            </a>
          </div>
          <div className="mt-6">
            <a
              href="/login"
              className="inline-block bg-blue-600 text-white text-lg px-6 py-2 rounded-md hover:bg-blue-500 transition duration-200"
            >
              Login
            </a>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default Home;
