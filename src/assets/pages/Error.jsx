import React from 'react';
import { Link } from 'react-router-dom';
import { FaSadTear } from 'react-icons/fa';

function Error() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fff0f3] to-[#fce4ec] px-4">
      <div className="bg-white shadow-xl rounded-3xl p-10 max-w-xl w-full text-center">
        <div className="text-[#F76B8A] mb-4">
          <FaSadTear className="text-6xl mx-auto mb-2" />
          <h1 className="text-7xl font-extrabold">404</h1>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">Oops! Page Not Found</h2>
        <p className="text-gray-600 mb-6">
          The page you're looking for doesn't exist, has been moved, or is temporarily unavailable.
        </p>
        <Link
          to="/"
          className="inline-block bg-[#F76B8A] hover:bg-[#e85c7a] text-white px-6 py-3 rounded-full font-semibold shadow-md transition-transform hover:scale-105"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default Error;
