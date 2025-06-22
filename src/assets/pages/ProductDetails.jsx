import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { BiSolidOffer } from "react-icons/bi";
import { MdLocalOffer } from "react-icons/md";
import { FaShoppingCart, FaBolt, FaHeart } from "react-icons/fa";


function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [similar, setSimilar] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [price, setPrice] = useState(0);
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });
    const [Orders,Set_Orders] = useState({});


    const showAlert = (message, type = 'error') => {
        setAlert({ show: true, message, type });
        setTimeout(() => setAlert({ show: false, message: '', type: '' }), 4000);
    };

    useEffect(() => {
        async function fetchProduct() {
            const { data, error } = await supabase
                .from('items')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error fetching product:', error);
            } else {
                setProduct(data);
                if (data?.category) {
                    fetchSimilar(data.category, data.id);
                }
            }
            setLoading(false);
        }

        async function fetchSimilar(category, currentId) {
            const { data, error } = await supabase
                .from('items')
                .select('*')
                .eq('category', category)
                .neq('id', currentId)
                .limit(4);

            if (error) {
                console.error('Error fetching similar products:', error);
            } else {
                setSimilar(data);
            }
        }

        function getUserData() {
            const user = sessionStorage.getItem('user');
            if (user) {
                const data = JSON.parse(user)[0]?.id;
                setUserId(data);
                getOrders();
            }
        }
         async function getOrders(){
               const {data , error} = await supabase.from("users_needles").select("orders");
               if(error){
                console.log(`Error occurs during the fletching the details ${error}`)
                return
               }
             
               Set_Orders(data[0]?.orders);


        }

        getUserData();
        fetchProduct();
    }, [id]);

    useEffect(() => {
        if (product) {
            setPrice(product.price * quantity);
        }
    }, [quantity, product]);



    const handleQuantityChange = (type) => {
        if (type === 'inc') {
            setQuantity(prev => prev + 1);
        } else if (type === 'dec' && quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };
    
    
 async function Addcart() {
  if (userId) {
    // ✅ 1) Get current cart for the user
    const { data, error: fetchError } = await supabase
      .from('users_needles')
      .select('cart')
      .eq('id', userId)
      .single();

    if (fetchError) {
      console.error("Error fetching cart:", fetchError);
      showAlert("Failed to fetch cart. Please try again.", "error");
      return;
    }

    let currentCart = data?.cart || [];

    // ✅ 2) Check if item is already in cart
    const existingItemIndex = currentCart.findIndex(item => item.id === id);

    if (existingItemIndex !== -1) {
      // ✅ 3) If exists, update quantity
      currentCart[existingItemIndex].quantity += quantity;
    } else {
      // ✅ 4) If not exists, add new item
      currentCart.push({ id: id, quantity: quantity });
    }

    // ✅ 5) Update cart in Supabase
    const { error: updateError } = await supabase
      .from('users_needles')
      .update({ cart: currentCart })
      .eq('id', userId);

    if (updateError) {
      console.error("Error updating cart:", updateError);
      showAlert("Failed to update cart. Please try again.", "error");
    } else {
      showAlert("Item added to cart successfully!", "success");
    }
  } else {
    console.warn("User not logged in!");
    showAlert("Please log in to add items to your cart.", "error");
  }
}


    return (
        <div className="relative min-h-screen flex flex-col bg-white">
            <NavBar />

            <main className="flex-grow container mx-auto p-6">
                {loading && <p className="text-center text-lg">Loading...</p>}

                {!loading && product && (
                    <>
                        {/* PRODUCT SECTION */}
                        <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden">
                            {/* Image */}
                            <div className="md:w-1/2 bg-gray-100 flex items-center justify-center p-8">
                                <img
                                    src={product.image_url || 'https://via.placeholder.com/400'}
                                    alt={product.name}
                                    className="max-h-[400px] object-contain rounded"
                                />
                            </div>

                            {/* Details */}
                            <div className="md:w-1/2 p-8 flex flex-col gap-4">
                                <h1 className="text-3xl font-semibold text-gray-800">{product.name}</h1>

                                <div className="flex items-center gap-3 text-2xl font-bold text-gray-800">
                                    ₹{Math.round(price * (1 - product.offer_percent / 100))}
                                    {product.offer_percent > 0 && (
                                        <>
                                            <MdLocalOffer className="text-pink-500" />
                                            <span className="text-base text-gray-500 line-through">
                                                ₹{product.price}
                                            </span>
                                            <span className="px-2 py-0.5 bg-green-50 text-green-700 text-sm rounded flex items-center gap-1">
                                                {product.offer_percent}% <BiSolidOffer /> OFF
                                            </span>
                                        </>
                                    )}
                                </div>

                                <p className="text-gray-600">{product.description}</p>
                                <p className="text-sm text-gray-500">
                                    Category: {product.category} / {product.subcategory}
                                </p>
                                <p className="text-xs text-gray-400">
                                    Added on: {new Date(product.created_at).toLocaleDateString()}
                                </p>

                                {/* QUANTITY SELECTOR */}
                                <div className="flex items-center gap-4 mt-6">
                                    <span className="text-sm text-gray-700 font-medium">Quantity:</span>
                                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                                        <button
                                            onClick={() => handleQuantityChange('dec')}
                                            className="w-10 h-10 flex items-center justify-center text-lg font-bold bg-gray-50 hover:bg-gray-100 transition"
                                        >
                                            -
                                        </button>
                                        <span className="w-12 text-center text-base font-semibold text-gray-800">{quantity}</span>
                                        <button
                                            onClick={() => handleQuantityChange('inc')}
                                            className="w-10 h-10 flex items-center justify-center text-lg font-bold bg-gray-50 hover:bg-gray-100 transition"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                {/* ACTION BUTTONS */}
                                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                                    <button className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded font-medium flex items-center justify-center gap-2 transition" onClick={() => {
                                        if (!userId) {
                                            showAlert(<p>Please <span className='underline cursor-pointer' onClick={() => { navigate('/login') }}>login</span>  or <span className='underline cursor-pointer' onClick={() => { navigate('/signup') }}>sign</span>  in to continue purchase</p>, 'error');
                                        }
                                        else{
                                            Addcart()
                                        }
                                    }} >
                                        <FaShoppingCart /> Add to Cart
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium flex items-center justify-center gap-2 transition"
                                        onClick={() => {
                                            if (!userId) {
                                                showAlert(<p>Please <span className='underline cursor-pointer' onClick={() => { navigate('/login') }}>login</span>  or <span className='underline cursor-pointer' onClick={() => { navigate('/signup') }}>sign</span>  in to continue purchase</p>, 'error');
                                            }
                                            else{
                                                navigate(`/buy/${id}`);
                                            }
                                        }}
                                    >
                                        <FaBolt /> Buy Now
                                    </button>
                                    <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded font-medium flex items-center justify-center gap-2 transition" onClick={() => {
                                        if (!userId) {
                                            showAlert(<p>Please <span className='underline cursor-pointer' onClick={() => { navigate('/login') }}>login</span>  or <span className='underline cursor-pointer' onClick={() => { navigate('/signup') }}>sign</span>  in to continue purchase</p>, 'error');
                                        }
                                    }} >
                                        <FaHeart /> Wishlist
                                    </button>
                                </div>

                                {/* ALERT */}
                                {alert.show && (
                                    <div className={`mt-4 px-4 py-2 rounded border ${alert.type === 'error'
                                        ? 'border-red-400 bg-red-50 text-red-700'
                                        : 'border-green-400 bg-green-50 text-green-700'
                                        }`}>
                                        {alert.message}

                                    </div>
                                )}
                            </div>
                        </div>

                        {/* SIMILAR PRODUCTS */}
                        {similar.length > 0 && (
                            <div className="mt-12">
                                <h2 className="text-2xl font-bold mb-4 text-gray-800">Similar Products</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                                    {similar.slice(0, 4).map((item) => (
                                        <div
                                            key={item.id}
                                            onClick={() => navigate(`/product/${item.id}`)}
                                            className="bg-white rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition cursor-pointer overflow-hidden"
                                        >
                                            <img
                                                src={item.image_url || 'https://via.placeholder.com/300'}
                                                alt={item.name}
                                                className="w-full h-40 object-contain p-4"
                                            />
                                            <div className="p-4">
                                                <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
                                                <p className="text-gray-800 font-bold">
                                                    ₹{item.final_price || item.price}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}

                {!loading && !product && (
                    <p className="text-red-500 text-center">Product not found.</p>
                )}
            </main>

            <Footer />
        </div>
    );
}

export default ProductDetails;
