import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import {
  FiMapPin, FiTruck, FiCreditCard, FiShoppingBag,
  FiUser, FiPackage, FiCheckCircle, FiArrowRight
} from 'react-icons/fi';
import NavBar from '../components/NavBar';

function Buy() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [user, setUser] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null);

  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem('user'));
    if (data && Array.isArray(data) && data.length > 0) {
      setUser(data[0]);
    } else {
      navigate('/account');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchItem = async () => {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('id', id)
        .single();
      if (error) console.error(error);
      else setItem(data);
    };
    fetchItem();
  }, [id]);

  const handlePlaceOrder = async () => {
    if (!user || !item) return;

    const now = new Date();
    const dispatchDate = new Date(now);
    dispatchDate.setDate(now.getDate() + 1);
    const deliveryDate = new Date(now);
    deliveryDate.setDate(now.getDate() + 5);

    const newOrder = {
      order_id: crypto.randomUUID(),
      items: [
        {
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: quantity,
          total: item.price * quantity,
        },
      ],
      total_amount: item.price * quantity,
      status: 'placed',
      placed_at: now.toISOString(),
      dispatch_date: dispatchDate.toISOString(),
      delivery_date: deliveryDate.toISOString(),
    };

    const { data, error: fetchError } = await supabase
      .from('users_needles')
      .select('orders')
      .eq('id', user.id)
      .single();

    if (fetchError) {
      console.error(fetchError);
      setAlertMessage('Failed to get existing orders.');
      return;
    }

    const existingOrders = data.orders || [];
    const updatedOrders = [...existingOrders, newOrder];

    const { error: updateError } = await supabase
      .from('users_needles')
      .update({ orders: updatedOrders })
      .eq('id', user.id);

    if (updateError) {
      console.error(updateError);
      setAlertMessage('Failed to place order.');
    } else {
      setPlacedOrder(newOrder);
      setAlertMessage('Order Placed Successfully!');
    }
  };

  if (!item) return <div className="text-center p-10">Loading product...</div>;

  return (
    <div className="min-h-screen bg-[#fef3f4] text-[#2D2D2D] relative">
      <div className='w-full'><NavBar /></div>

      {alertMessage && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg z-50">
          {alertMessage}
        </div>
      )}

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row gap-6 mt-10">
        {!placedOrder ? (
          <>
            <img
              src={item.image_url}
              alt={item.name}
              className="w-full md:w-1/3 rounded-xl object-cover"
            />

            <div className="flex-1 space-y-4">
              <h1 className="text-2xl md:text-3xl font-bold text-pink-600">{item.name}</h1>
              <p className="text-gray-600">{item.description}</p>

              <div className="flex items-center gap-2 text-lg font-bold">
                <FiShoppingBag /> ₹{item.price} × {quantity} = ₹{item.price * quantity}
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 bg-pink-200 rounded-full font-bold"
                >
                  -
                </button>
                <span>{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 bg-pink-200 rounded-full font-bold"
                >
                  +
                </button>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <FiUser className="text-pink-600" />
                  <span>{user?.name} | {user?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiMapPin className="text-pink-600" />
                  <span>{user?.address || 'No Address Provided'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiPackage className="text-pink-600" />
                  <span>Dispatch: {new Date(new Date().setDate(new Date().getDate() + 1)).toDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiTruck className="text-pink-600" />
                  <span>Delivery: {new Date(new Date().setDate(new Date().getDate() + 5)).toDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCreditCard className="text-pink-600" />
                  <span>Payment: Cash on Delivery</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                className="mt-4 px-6 py-3 bg-pink-600 text-white rounded-full shadow hover:bg-pink-700 transition"
              >
                Place Order
              </button>
            </div>
          </>
        ) : (
          <div className="w-full">
            <h2 className="text-2xl md:text-3xl font-bold text-green-600 mb-4 flex items-center gap-2">
              <FiCheckCircle /> Order Placed Successfully!
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                <strong>Order ID:</strong> {placedOrder.order_id}
              </p>
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-1 flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <FiCheckCircle className="text-green-600" />
                    <span>Order Placed: {new Date(placedOrder.placed_at).toDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiPackage className="text-yellow-600" />
                    <span>Dispatching on: {new Date(placedOrder.dispatch_date).toDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiTruck className="text-blue-600" />
                    <span>Estimated Delivery: {new Date(placedOrder.delivery_date).toDateString()}</span>
                  </div>
                </div>
                <div className="text-center">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/3500/3500833.png"
                    alt="Delivery Truck"
                    className="w-32 md:w-48"
                  />
                </div>
              </div>
              <button
                onClick={() => navigate('/account')}
                className="mt-6 px-6 py-3 bg-green-600 text-white rounded-full shadow hover:bg-green-700 transition"
              >
                Go to My Orders
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Buy;
