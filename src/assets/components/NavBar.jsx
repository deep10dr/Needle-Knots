import React, { useState, useEffect } from 'react';
import {
  FiSearch,
  FiShoppingCart,
  FiHeart,
  FiUser,
  FiMenu,
  FiX,
  FiPhone,
  FiHelpCircle,
} from 'react-icons/fi';
import { AiOutlineCloudUpload } from "react-icons/ai";
import { useNavigate, useLocation } from 'react-router-dom';

function NavBar({ onCategorySelect }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [admin, setAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories = ['Blouses', 'Sarees', 'Lehengas', 'Aari Works', 'Custom Orders'];

  useEffect(() => {
    const user = sessionStorage.getItem('user');
    if (user) {
      const parsed = JSON.parse(user);
      if (parsed[0]?.role === 'admin') {
        setAdmin(true);
      }
    }
  }, []);

  return (
    <div className="w-full shadow-md bg-white">
      {/* Desktop Nav */}
      <div className="hidden md:flex flex-col">
        <div className="flex items-center justify-between px-4 py-2">
          <h1 className="text-2xl font-extrabold text-[#F76B8A] cursor-pointer" onClick={() => navigate("/")}>Needle & Knots</h1>
          <div className="flex items-center border rounded-2xl shadow-md overflow-hidden w-64 bg-[#FFFFFF]">
            <FiSearch className="cursor-pointer text-lg mx-2 text-[#2D2D2D] hover:text-[#F76B8A]" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent focus:outline-none w-full px-2 py-1 text-[#2D2D2D]"
            />
          </div>
          <div className="flex items-center gap-4 text-[#2D2D2D] text-xl">
            <span className="text-sm cursor-pointer hover:underline">Become a Franchise</span>
            <FiHeart className="cursor-pointer hover:text-[#F76B8A]" title="Wishlist" onClick={() => navigate("/wishlist")} />
            <FiShoppingCart className="cursor-pointer hover:text-[#F76B8A]" title="Cart" onClick={() => navigate("/cart")} />
            <FiUser className="cursor-pointer hover:text-[#F76B8A]" title="Account" onClick={() => navigate("/account")} />
            {admin && <AiOutlineCloudUpload className="cursor-pointer hover:text-[#F76B8A]" title="Upload Items" onClick={() => navigate('/uploaditems')} />}
          </div>
        </div>

        {/* ✅ Show categories only on /home */}
        {location.pathname === "/" && (
          <div className="flex justify-center gap-4 px-4 py-2 bg-[#FFF0F3] text-[#2D2D2D] text-sm font-medium">
            {categories.map((cat) => (
              <span
                key={cat}
                onClick={() => onCategorySelect(cat)}
                className="cursor-pointer hover:underline"
              >
                {cat}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Mobile Nav */}
      <div className="flex md:hidden flex-col px-4 py-2 gap-2 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenuOpen(true)} className="text-2xl text-[#2D2D2D]">
              <FiMenu />
            </button>
            <h1 className="text-xl font-bold text-[#F76B8A]" onClick={() => navigate("/home")}>Needle & Knots</h1>
          </div>
          <div className="flex items-center gap-4 text-[#2D2D2D] text-xl">
            <FiHeart className="cursor-pointer hover:text-[#F76B8A]" title="Wishlist" onClick={() => navigate('/wishlist')} />
            <FiShoppingCart className="cursor-pointer hover:text-[#F76B8A]" title="Cart" onClick={() => navigate('/cart')} />
            {admin && <AiOutlineCloudUpload className="cursor-pointer hover:text-[#F76B8A]" title="Upload Items" onClick={() => navigate('/uploaditems')} />}
          </div>
        </div>
        <div className="flex items-center rounded-4xl shadow-2xl border bg-[#FFFFFF] mt-2">
          <FiSearch className="mx-2 text-lg text-[#2D2D2D]" />
          <input
            type="text"
            placeholder="Search for products..."
            className="bg-transparent focus:outline-none w-full px-2 py-2 text-[#2D2D2D]"
          />
        </div>

        {/* ✅ Mobile menu drawer */}
        <div className={`fixed top-0 left-0 h-full w-64 bg-[#FFF0F3] text-[#2D2D2D] text-sm font-medium shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex justify-end px-4 py-3">
            <button onClick={() => setMobileMenuOpen(false)} className="text-2xl text-[#2D2D2D]">
              <FiX />
            </button>
          </div>
          <div>
            <img
              src="https://img.freepik.com/free-vector/special-offer-creative-sale-banner-design_1017-16284.jpg"
              alt="Special Offer"
              className="w-full rounded-md object-cover"
            />
          </div>
          <div className="flex flex-col gap-3 p-4">
            <div className="flex items-center gap-2 cursor-pointer hover:underline" onClick={() => { navigate("/account"); setMobileMenuOpen(false); }}>
              <FiUser /> <span>Account</span>
            </div>
          </div>
          {/* ✅ Mobile categories only on /home */}
          {location.pathname === "/home" && (
            <nav className="flex flex-col gap-4 p-4">
              {categories.map((cat) => (
                <span
                  key={cat}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onCategorySelect(cat);
                  }}
                  className="cursor-pointer hover:underline"
                >
                  {cat}
                </span>
              ))}
            </nav>
          )}
          <div className="flex flex-col gap-3 p-4">
            <div className="flex items-center gap-2 cursor-pointer hover:underline">
              <FiPhone /> <span>Contact</span>
            </div>
            <div className="flex items-center gap-2 cursor-pointer hover:underline">
              <FiHelpCircle /> <span>Support</span>
            </div>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 z-40" onClick={() => setMobileMenuOpen(false)} />
        )}
      </div>
    </div>
  );
}

export default NavBar;
