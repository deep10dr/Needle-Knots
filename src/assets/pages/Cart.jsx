import React, { useEffect, useState } from 'react';
import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa';
import Footer from '../components/Footer';
import AccountAlert from '../components/AlertAccount';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const [cart, setCart] = useState([]);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem('user'));
    if (!storedUser) {
      setUserId(null);
      setCart([]);
      return;
    }
    const uid = storedUser[0]?.id;
    setUserId(uid);
    fetchCart(uid);
  }, []);

  // ✅ Get cart from Supabase and resolve full item info
  async function fetchCart(uid) {
    const { data, error } = await supabase
      .from('users_needles')
      .select('cart')
      .eq('id', uid)
      .single();

    if (error) {
      console.error('Error fetching cart:', error);
      return;
    }

    if (data?.cart?.length) {
      const itemsData = [];
      for (const cartItem of data.cart) {
        const { data: itemData, error: itemError } = await supabase
          .from('items')
          .select('*')
          .eq('id', cartItem.id)
          .single();

        if (itemError) {
          console.error(itemError);
        } else {
          itemsData.push({ ...itemData, quantity: cartItem.quantity });
        }
      }
      setCart(itemsData);
    } else {
      setCart([]);
    }
  }

  // ✅ Update quantity and sync with Supabase
  async function updateQuantity(id, action) {
    const updatedCart = cart.map(item =>
      item.id === id
        ? {
          ...item,
          quantity:
            action === 'increase'
              ? item.quantity + 1
              : item.quantity > 1
                ? item.quantity - 1
                : 1,
        }
        : item
    );
    setCart(updatedCart);
    await syncCartToSupabase(updatedCart);
  }

  // ✅ Remove item and sync
  async function removeItem(id) {
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);
    await syncCartToSupabase(updatedCart);
  }

  // ✅ Write new cart state back to Supabase `cart`
  async function syncCartToSupabase(updatedCart) {
    const minimalCart = updatedCart.map(item => ({
      id: item.id,
      quantity: item.quantity,
    }));

    const { error } = await supabase
      .from('users_needles')
      .update({ cart: minimalCart })
      .eq('id', userId);

    if (error) {
      console.error('Error updating cart:', error);
    }
  }

  // ✅ Totals
  const totalMRP = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = 0.1 * totalMRP;
  const shipping = totalMRP > 2000 ? 0 : 99;
  const total = totalMRP - discount + shipping;

  return (
    <div className="relative min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - Cart Items */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-700">
            My Cart ({cart.length} items)
          </h2>

          {cart.length === 0 ? (
            <p className="text-center text-gray-500">Your cart is empty.</p>
          ) : (
            cart.map(item => (
              <div
                key={item.id}
                className="flex items-start gap-4 py-4 border-b last:border-none cursor-pointer"

              >
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-24 h-24 object-contain"
                  onClick={() => { navigate(`/product/${item.id}`) }
                  }    
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-sm text-gray-500">
                    Seller: {item.seller || 'N/A'}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-lg font-semibold text-[#F76B8A]">
                      ₹{item.price}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => updateQuantity(item.id, 'decrease')}
                      className="bg-gray-200 px-2 py-1 rounded"
                    >
                      <FaMinus size={12} />
                    </button>
                    <span className="text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 'increase')}
                      className="bg-gray-200 px-2 py-1 rounded"
                    >
                      <FaPlus size={12} />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="ml-4 text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right - Price Summary */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-bold text-gray-700 mb-4">Price Details</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Price ({cart.length} items)</span>
              <span>₹{totalMRP.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span className="text-green-600">− ₹{discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-semibold text-gray-800">
              <span>Total Amount</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex items-center justify-center w-full">
            <button
              className="w-40 mt-6 bg-[#F76B8A] text-white py-2 rounded-md text-sm font-medium hover:bg-[#e35b79] transition"
              disabled={cart.length === 0}
            >
              Place Order
            </button>
          </div>
        </div>
      </div>

      {!userId && (
        <div className="fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50">
          <AccountAlert />
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Cart;
