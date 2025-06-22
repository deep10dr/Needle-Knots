import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Range } from 'react-range';
import { BiSolidOffer } from "react-icons/bi";
import { MdLocalOffer } from "react-icons/md";
/**
 * Items component.
 * @param {string} paramCategory - Optional category to auto-filter items.
 */
function Items({ paramCategory = '' }) {
    const [items, setItems] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [filter, setFilter] = useState('');
    const [priceRange, setPriceRange] = useState([100, 1000000]);
    const [sortOrder, setSortOrder] = useState('latest');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const PRICE_MIN = 0;
    const PRICE_MAX = 1000000;

    const navigate = useNavigate();

    useEffect(() => {
        async function getItems() {
            try {
                const { data, error } = await supabase.from('items').select('*');
                if (error) throw error;
                setItems(data || []);
                setFiltered(data || []);
            } catch (err) {
                console.error('Error fetching items:', err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        getItems();
    }, []);

    useEffect(() => {
        filterItems();
    }, [filter, priceRange, sortOrder, items, paramCategory]); // 👈 depend on paramCategory too

    const filterItems = () => {
        let result = [...items];

        // ✅ If paramCategory is given, filter by it first:
        if (paramCategory) {
            result = result.filter(
                (item) => item.category.toLowerCase() === paramCategory.toLowerCase()
            );
        }

        // ✅ Apply text filter if any
        if (filter) {
            const value = filter.toLowerCase();
            result = result.filter(
                (item) =>
                    item.name.toLowerCase().includes(value) ||
                    item.category.toLowerCase().includes(value) ||
                    (item.subcategory && item.subcategory.toLowerCase().includes(value))
            );
        }

        // ✅ Apply price range
        result = result.filter(
            (item) => item.price >= priceRange[0] && item.price <= priceRange[1]
        );

        // ✅ Apply sort
        switch (sortOrder) {
            case 'latest':
                result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                break;
            case 'oldest':
                result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                break;
            case 'price-low-high':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-high-low':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'most-sold':
                result.sort((a, b) => (b.sold || 0) - (a.sold || 0));
                break;
            default:
                break;
        }

        setFiltered(result);
    };

    return (
        <div className="p-6 space-y-8 max-w-screen-xl mx-auto ">
            {/* Filter Panel */}
            <div className="p-6 bg-white shadow rounded-xl space-y-6">
                <div className="flex flex-col md:flex-row md:items-end md:space-x-8 space-y-4 md:space-y-0">

                    {/* Search */}
                    <div className="flex-1">
                        <label className="block mb-1 font-semibold text-gray-700">Search</label>
                        <input
                            type="text"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            placeholder="Name, category, subcategory..."
                            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    {/* Price Range */}
                    <div className="flex-1">
                        <label className="block mb-1 font-semibold text-gray-700">
                            Price Range:
                        </label>
                        <Range
                            step={100}
                            min={PRICE_MIN}
                            max={PRICE_MAX}
                            values={priceRange}
                            onChange={setPriceRange}
                            renderTrack={({ props, children }) => (
                                <div
                                    {...props}
                                    className="h-2 bg-gray-200 rounded-full relative"
                                >
                                    {children}
                                </div>
                            )}
                            renderThumb={({ props, index }) => (
                                <div
                                    {...props}
                                    className="w-5 h-5 bg-blue-600 border-2 border-white rounded-full shadow cursor-pointer transform hover:scale-110 transition"
                                >
                                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-gray-700">
                                        ₹{priceRange[index]}
                                    </div>
                                </div>
                            )}
                        />
                    </div>

                    {/* Sort Order */}
                    <div className="flex-1">
                        <label className="block mb-1 font-semibold text-gray-700">Sort By</label>
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="latest">Latest</option>
                            <option value="oldest">Oldest</option>
                            <option value="price-low-high">Price: Low to High</option>
                            <option value="price-high-low">Price: High to Low</option>
                            <option value="most-sold">Most Sold</option>
                        </select>
                    </div>

                </div>
            </div>

            {/* Loading & Error */}
            {loading && <p className="text-gray-700">Loading items...</p>}
            {error && <p className="text-red-600">Error: {error}</p>}

            {/* Items Grid */}
            {!loading && !error && filtered.length === 0 && (
                <p className="text-gray-500 text-center">No items match your filter.</p>
            )}

            {!loading && !error && filtered.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filtered.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => navigate(`/product/${item.id}`)}
                            className="bg-white rounded-xl shadow hover:shadow-xl transition p-4 cursor-pointer flex flex-col justify-between"
                        >
                            <img
                                src={item.image_url || 'https://via.placeholder.com/150'}
                                alt={item.name}
                                className="w-full h-56 object-contain rounded mb-4 bg-gray-50"
                            />
                            <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                            <p className="text-sm text-gray-600 mb-1">
                                Category: {item.category} / {item.subcategory}
                            </p>
                            <p className="text-sm text-gray-600 mb-1">
                                Stock: {item.stock}
                            </p>

                            <div className="font-bold text-[#F76B8A] text-lg flex  items-center gap-2">
                               ₹{(item.price * (1 - item.offer_percent / 100)).toFixed(2)}  <MdLocalOffer /> 
                            </div>
                            <div className="text-sm text-gray-600 mb-1  flex gap-2">
                            <p>Original Price:  <span className='line-through'>  ₹{item.price.toFixed(2)}</span></p> <div className='text-green-400 font-bold flex justify-center items-center '>Offer: {item.offer_percent} <div><BiSolidOffer /></div> </div>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Items;
