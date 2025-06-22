import React, { useState } from 'react';
import {
  HiMail, HiLockClosed, HiUser, HiPhone, HiEye, HiEyeOff
} from 'react-icons/hi';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebookF } from 'react-icons/fa';
import { supabase, supabaseAdmin } from '../lib/supabaseClient';

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone' && !/^\d*$/.test(value)) return; // only numbers
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const showAlert = (message, type = 'error') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 5000);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const { name, email, phone, password } = form;

    if (!name || !email || !phone || !password)
      return showAlert('All fields are required!');

    if (phone.length !== 10)
      return showAlert('Phone number must be 10 digits');

    setLoading(true);

    // Check if user already exists in your custom table
    const { data: existingUsers, error: checkError } = await supabase
      .from('users_needles')
      .select('id')
      .or(`email.eq.${email},phone.eq.${phone}`);

    if (checkError) {
      setLoading(false);
      return showAlert('Something went wrong while checking user!');
    }

    if (existingUsers.length > 0) {
      setLoading(false);
      return showAlert('Email or phone number already exists!');
    }

    // Create Auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password
    });

    if (authError) {
      setLoading(false);
      return showAlert(authError.message);
    }

    // Ask user to check email
    showAlert('Check your email to verify your account.', 'success');
    setVerifying(true);

    // Poll for verification
    let verified = false;
    let tries = 0;
    const maxTries = 10;

    while (tries < maxTries) {
      const { data, error } = await supabaseAdmin.auth.admin.getUserById(authData.user.id);

      if (error) {
        setLoading(false);
        setVerifying(false);
        return showAlert('Failed to check verification status.');
      }

      if (data.user.email_confirmed_at) {
        verified = true;
        break;
      }

      // wait 5 seconds
      await new Promise((r) => setTimeout(r, 5000));
      tries++;
    }

    if (!verified) {
      setLoading(false);
      setVerifying(false);
      return showAlert('Verification timeout. Please try again.');
    }

    // Insert to custom table only if verified
    const { error: insertError } = await supabase.from('users_needles').insert([
      {
        id: authData.user.id,
        name,
        email,
        phone,
        password // Note: for production, never store plain passwords!
      }
    ]);

    setLoading(false);
    setVerifying(false);

    if (insertError) {
      return showAlert(insertError.message);
    }

    showAlert('Signup successful! You can now log in.', 'success');
    setForm({ name: '', email: '', phone: '', password: '' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fdecef] to-[#fff0f3] px-4 relative">
      {alert.show && (
        <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-xl shadow-lg text-white ${
          alert.type === 'error' ? 'bg-red-500' : 'bg-green-500'
        }`}>
          {alert.message}
        </div>
      )}

      <div className="bg-white shadow-2xl rounded-3xl md:w-96 w-full max-w-sm p-8 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#F76B8A]">Create an Account</h2>
          <p className="text-sm text-gray-500 mt-1">Sign up to get started</p>
        </div>

        <form className="space-y-4" onSubmit={handleSignUp}>
          <InputField icon={<HiUser />} name="name" value={form.name} onChange={handleInputChange} placeholder="Full Name" />
          <InputField icon={<HiMail />} name="email" value={form.email} onChange={handleInputChange} placeholder="Email" type="email" />
          <InputField icon={<HiPhone />} name="phone" value={form.phone} onChange={handleInputChange} placeholder="Phone Number" maxLength={10} />
          <div className="relative">
            <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleInputChange}
              required
              className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F76B8A]"
            />
            <div
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <HiEyeOff /> : <HiEye />}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || verifying}
            className={`w-full py-2 rounded-md text-sm font-medium text-white ${
              loading || verifying ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#F76B8A] hover:bg-[#e35b79]'
            }`}
          >
            {verifying ? 'Verifying Email...' : loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>

        {verifying && <p className="text-sm text-gray-600 text-center animate-pulse">Waiting for email verification...</p>}

        <div className="text-center space-y-3">
          <p className="text-sm text-gray-500">Or sign up with</p>
          <div className="flex justify-center gap-4">
            <SocialButton icon={<FcGoogle />} label="Google" />
            <SocialButton icon={<FaFacebookF />} label="Facebook" color="text-[#3b5998]" />
          </div>
        </div>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <a href="/login" className="text-[#F76B8A] font-medium hover:underline">Log in</a>
        </p>
      </div>
    </div>
  );
}

const InputField = ({ icon, name, value, onChange, placeholder, type = 'text', maxLength }) => (
  <div className="relative">
    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      maxLength={maxLength}
      required
      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F76B8A]"
    />
  </div>
);

const SocialButton = ({ icon, label, color = 'text-gray-700' }) => (
  <button className={`flex items-center gap-2 border border-gray-300 px-4 py-1.5 rounded-md hover:shadow-md transition text-sm ${color}`}>
    {icon} {label}
  </button>
);

export default SignUp;
