import React, { useState } from 'react';
import { HiMail, HiLockClosed } from 'react-icons/hi';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebookF } from 'react-icons/fa';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom'; // ✅ If using React Router

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // ✅

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const showAlert = (message, type = 'error') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 4000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { email, password } = form;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      return showAlert(error.message);
    }

    const uid = data.user.id;
    let value = null;

    // ✅ Correct query for your custom table:
    const { data: user_data, error: user_error } = await supabase
      .from("users_needles")
      .select("*")
      .eq("id", uid);

    if (user_error) {
      console.error("User table error:", user_error);
      
    } else {
      console.log("User table data:", user_data);
      value = user_data
    }

    // ✅ Store in sessionStorage
    sessionStorage.setItem('user', JSON.stringify(value));
    console.log("Logged in user:", data.user);

    setLoading(false);
    showAlert('Login successful!', 'success');

    // ✅ Redirect to account page:
    navigate(-1);
    // OR fallback if not using React Router:
    // window.location.href = "/account";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fdecef] to-[#fff0f3] px-4 relative">
      {alert.show && (
        <div
          className={`absolute top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-xl shadow-lg text-white ${
            alert.type === 'error' ? 'bg-red-500' : 'bg-green-500'
          }`}
        >
          {alert.message}
        </div>
      )}

      <div className="bg-white shadow-2xl rounded-3xl w-80 md:w-90 p-8 space-y-6 transition-all duration-300">
        {/* Title */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#F76B8A]">Welcome Back</h2>
          <p className="text-sm text-gray-500 mt-1">Log in to your account</p>
        </div>

        {/* Form */}
        <form className="space-y-4 w-full" onSubmit={handleLogin}>
          {/* Email */}
          <div className="relative w-full">
            <HiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F76B8A] transition"
            />
          </div>

          {/* Password */}
          <div className="relative w-full">
            <HiLockClosed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F76B8A] transition"
            />
          </div>

          {/* Forgot Password */}
          <div className="text-right text-sm">
            <a href="/forgot-password" className="text-[#F76B8A] hover:underline cursor-pointer">
              Forgot Password?
            </a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-32 mx-auto block cursor-pointer ${
              loading ? 'bg-gray-400' : 'bg-[#F76B8A] hover:bg-[#e35b79]'
            } text-white py-1.5 rounded-md text-sm font-medium transition`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Social Login */}
        <div className="text-center space-y-3">
          <p className="text-sm text-gray-500">Or login with</p>
          <div className="flex justify-center gap-4">
            <button className="flex items-center cursor-pointer gap-2 border border-gray-300 px-4 py-1.5 rounded-md hover:shadow-md transition text-sm">
              <FcGoogle className="text-lg" /> Google
            </button>
            <button className="flex items-center gap-2 cursor-pointer border border-gray-300 px-4 py-1.5 rounded-md hover:shadow-md transition text-sm text-[#3b5998]">
              <FaFacebookF className="text-lg" /> Facebook
            </button>
          </div>
        </div>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-gray-500">
          Don’t have an account?{' '}
          <a href="/signup" className="text-[#F76B8A] font-medium hover:underline cursor-pointer">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
