import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { asyncHandler } from '../../../api/utility/asyncHandler';
import { signOutStart,signOutSuccess,signOutFailure } from '../redux/user/userSlice';

function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleClick = async(e)=>{
    try {
      e.preventDefault();
      dispatch(signOutStart);
      const response = await fetch('/api/auth/logout',{
        method: 'POST',
        headers: {
          "Content-type": "application/json"
        }
      })
      const responseData = await response.json();
      if(responseData.success === false){
        dispatch(signOutFailure(responseData.message));
        return;
      }
      dispatch(signOutSuccess());
      navigate("/");
    } catch (error) {
      dispatch(signOutFailure(error.message))
    }
  }
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
            <button 
            onClick={handleClick}
            className="text-white bg-blue-500 hover:bg-blue-400 px-5 py-2 rounded-md transition duration-200">
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
