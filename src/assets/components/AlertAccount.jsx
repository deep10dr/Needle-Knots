import React from 'react';

function AlertAccount() {
  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-black/30 z-50">
      <div className="bg-white shadow-lg rounded-xl md:p-8 p-4 text-center space-y-4">
        <h2 className="text-2xl font-bold text-[#F76B8A]">Welcome!</h2>
        <p className="text-gray-600">Please login or sign up to access your account.</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => (window.location.href = '/login')}
            className="bg-[#F76B8A] text-white px-4 py-2 rounded hover:bg-pink-600 transition"
          >
            Login
          </button>
          <button
            onClick={() => (window.location.href = '/signup')}
            className="bg-gray-200 text-[#F76B8A] px-4 py-2 rounded hover:bg-gray-300 transition"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default AlertAccount;
