import React, { useEffect, useState } from 'react';
import {
  HiOutlineCreditCard,
  HiOutlineShoppingBag,
  HiOutlineUserCircle,
  HiOutlineGift,
} from 'react-icons/hi2';
import { HiLogout } from 'react-icons/hi';
import AlertAccount from '../components/AlertAccount';
import NavBar from '../components/NavBar';

// Sidebar Sections
const sections = [
  { name: 'Details', icon: HiOutlineUserCircle },
  { name: 'Orders', icon: HiOutlineShoppingBag },
  { name: 'Coupons', icon: HiOutlineGift },
  { name: 'Payment Methods', icon: HiOutlineCreditCard },
  { name: 'Logout', icon: HiLogout },
];

function Account() {
  const [userData, setUserData] = useState(null);
  const [selected, setSelected] = useState('Details');
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem('user'));
    if (data && Array.isArray(data) && data.length > 0) {
      setUserData(data[0]);
      setOrders(data[0]?.orders);
    } else {
      setUserData(null);
    }
  }, []);
  console.log(orders)
  const formatDateToIST = (utcDate) => {
    if (!utcDate) return '-';
    return new Date(utcDate).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const renderSection = () => {
    switch (selected) {
      case 'Details':
        return (
          <div className="space-y-2">
            <p><strong>Name:</strong> {userData?.name || '-'}</p>
            <p><strong>Email:</strong> {userData?.email || '-'}</p>
            <p><strong>Phone:</strong> {userData?.phone || '-'}</p>
            <p><strong>Address:</strong> {userData?.address || '-'}</p>
            <p><strong>Created At:</strong> {formatDateToIST(userData?.created_at)}</p>
          </div>
        );
    case 'Orders':
  return (
    <div className="space-y-4">
      {orders && orders.length > 0 ? (
        orders.map((order, index) => (
          <div
            key={index}
            className=" rounded-lg p-4 shadow-sm bg-white space-y-2"
          >
            <p className="font-semibold text-pink-600 mb-2 flex items-center gap-2">
              <HiOutlineShoppingBag className="text-pink-600" />
              Order {index + 1}
            </p>

            <div className="space-y-1 text-sm">
              {order.items.map((item, idx) => (
                <p key={idx} className="flex items-center gap-2">
                  <HiOutlineGift className="text-green-600" />
                  {item.name} — Qty: {item.quantity} — ₹{item.total}
                </p>
              ))}

              <p className="flex items-center gap-2">
                <HiOutlineCreditCard className="text-blue-600" />
                Total: ₹{order.total_amount}
              </p>

              <p className="flex items-center gap-2">
                📅 Placed:
                <span>{formatDateToIST(order.placed_at)}</span>
              </p>

              <p className="flex items-center gap-2">
                🚚 Dispatch:
                <span>{formatDateToIST(order.dispatch_date)}</span>
              </p>

              <p className="flex items-center gap-2">
                📦 Delivery:
                <span>{formatDateToIST(order.delivery_date)}</span>
              </p>

              <p className="flex items-center gap-2 text-green-700 font-medium">
                ✅ Status: {order.status}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );



      case 'Coupons':
        return <p>No coupons available.</p>;
      case 'Payment Methods':
        return <p>Add a credit/debit card.</p>;
      case 'Logout':
        return (
          <button
            onClick={() => {
              sessionStorage.clear();
              window.location.href = '/account';
            }}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Confirm Logout
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#fff0f3] to-[#fdecef] text-[#2D2D2D]">
      {/* ✅ Fixed Navbar */}
      <div className="fixed top-0 left-0 w-full z-50">
        <NavBar />
      </div>

      {/* ✅ Page Content */}
      <div className="pt-28 p-4">
        <div className="max-w-6xl mx-auto rounded-3xl bg-[#fef3f4] shadow-lg p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="col-span-1 bg-[#fef3f4] shadow p-4 rounded-xl space-y-6">
            {/* Profile & Coins */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/18753/18753518.png"
                  alt="User"
                  className="h-14 w-14"
                />
                <div>
                  <p className="text-xs">Hello</p>
                  <p className="text-lg font-semibold">
                    {userData?.name || 'Guest'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative group h-10 w-10">
                  <img
                    src="/coin.png"
                    alt="coin static"
                    className="h-5 w-5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 block group-hover:hidden"
                  />
                  <img
                    src="/coin.gif"
                    alt="coin gif"
                    className="h-full w-full absolute top-0 left-0 hidden group-hover:block"
                  />
                </div>
                <p className="text-xs">Coins: {userData?.coins ?? 0}</p>
              </div>
            </div>

            {/* Sidebar Menu */}
            <div className="space-y-2">
              {sections.map(({ name, icon: Icon }) => (
                <button
                  key={name}
                  onClick={() => setSelected(name)}
                  className={`flex items-center w-full px-3 py-2 rounded-md text-sm font-medium transition ${selected === name
                      ? 'bg-[#F76B8A] text-white'
                      : 'text-gray-600 hover:bg-pink-100'
                    }`}
                >
                  <Icon className="mr-2 text-lg" />
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-2 bg-[#fff0f3] shadow p-6 rounded-xl">
            <h2 className="text-xl font-bold text-[#F76B8A] mb-4">{selected}</h2>
            {renderSection()}
          </div>
        </div>

        {/* ✅ Block access if no user */}
        {!userData && (
          <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
            <AlertAccount />
          </div>
        )}
      </div>
    </div>
  );
}

export default Account;
