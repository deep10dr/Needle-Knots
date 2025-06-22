import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabaseClient';
import NavBar from '../components/NavBar';

// ✅ Simple Tailwind toast component
function Toast({ show, message, type, onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  return (
    show && (
      <div className={`fixed top-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-md shadow-xl text-white text-center transition-all duration-300
        ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}
      `}>
        {message}
      </div>
    )
  );
}

function UploadItems() {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subcategory: '',
    price: '',
    offer_percent: '',
    stock: '',
    description: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      showToast('Please select an image', 'error');
      return;
    }

    setUploading(true);

    try {
      // ✅ Check if 'data' bucket exists
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
      if (bucketError) throw bucketError;

      const bucketExists = buckets.some(bucket => bucket.name === 'data');
      if (!bucketExists) {
        throw new Error("Bucket 'data' does not exist. Please create it first!");
      }

      // ✅ Upload image to 'data' bucket
      const filePath = `items/${uuidv4()}-${imageFile.name}`;

      const { error: uploadError } = await supabase.storage
        .from('data')
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      // ✅ Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('data')
        .getPublicUrl(filePath);

      // ✅ Insert item record
      const { error: insertError } = await supabase
        .from('items')
        .insert([{ ...formData, image_url: publicUrl }]);

      if (insertError) throw insertError;

      showToast('Item uploaded successfully!', 'success');

      // ✅ Reset form
      setFormData({
        name: '',
        category: '',
        subcategory: '',
        price: '',
        offer_percent: '',
        stock: '',
        description: '',
      });
      setImageFile(null);
      setPreviewUrl(null);

    } catch (error) {
      console.error(error);
      showToast(error.message || 'Something went wrong!', 'error');
    }

    setUploading(false);
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center flex-col">
      <div className='w-full fixed top-0'><NavBar/></div>
       <div className='md:mt-23 mt-28 p-2'>
            <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />

      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-3xl rounded-xl shadow-xl p-8 space-y-6 border border-gray-200"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Upload New Item</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F76B8A] bg-gray-50"
              required
            />
          </div>

          {/* ✅ Category Dropdown */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F76B8A] bg-gray-50"
              required
            >
              <option value="">Select Category</option>
              <option value="Sarees">Sarees</option>
              <option value="Lehengas">Lehengas</option>
              <option value="Blouses">Blouses</option>
              <option value="Aari Works">Aari Works</option>
              <option value="Custom Orders">Custom Orders</option>
            </select>
          </div>

          {/* ✅ Subcategory Dropdown (Dynamic) */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Subcategory</label>
            <select
              name="subcategory"
              value={formData.subcategory}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F76B8A] bg-gray-50"
            >
              <option value="">Select Subcategory</option>
              {formData.category === 'Sarees' && (
                <>
                  <option value="Banarasi Saree">Banarasi Saree</option>
                  <option value="Kanjivaram Saree">Kanjivaram Saree</option>
                  <option value="Chiffon Saree">Chiffon Saree</option>
                  <option value="Georgette Saree">Georgette Saree</option>
                  <option value="Cotton Saree">Cotton Saree</option>
                  <option value="Silk Saree">Silk Saree</option>
                  <option value="Crepe Saree">Crepe Saree</option>
                  <option value="Tissue Saree">Tissue Saree</option>
                  <option value="Satin Saree">Satin Saree</option>
                  <option value="Organza Saree">Organza Saree</option>
                  <option value="Patola Saree">Patola Saree</option>
                  <option value="Bandhani Saree">Bandhani Saree</option>
                  <option value="Chanderi Saree">Chanderi Saree</option>
                  <option value="Paithani Saree">Paithani Saree</option>
                  <option value="Net Saree">Net Saree</option>
                </>
              )}

              {formData.category === 'Lehengas' && (
                <>
                  <option value="Readymade Lehenga">Readymade Lehenga</option>
                  <option value="Bridal Lehenga">Bridal Lehenga</option>
                  <option value="Embroidered Lehenga">Embroidered Lehenga</option>
                  <option value="Zardozi Work Lehenga">Zardozi Work Lehenga</option>
                  <option value="A-Line Lehenga">A-Line Lehenga</option>
                  <option value="Mermaid Lehenga">Mermaid or Fishtail Lehenga</option>
                  <option value="Kali Lehenga">Kali Lehenga</option>
                  <option value="Circular Lehenga">Circular Lehenga</option>
                  <option value="Straight Cut Lehenga">Straight Cut Lehenga</option>
                  <option value="Lehenga Saree">Lehenga Saree</option>
                  <option value="Sharara-cut Lehenga">Sharara-cut Lehenga</option>
                  <option value="Embellished Lehenga">Embellished Lehenga</option>
                </>
              )}

              {formData.category === 'Blouses' && (
                <>
                  <option value="Bridle Blouse">Bridle Blouse</option>
                  <option value="Padded Blouse">Padded Blouse</option>
                  <option value="Cups Blouse">Cups Blouse</option>
                  <option value="Front Open Blouse">Front Open Blouse</option>
                  <option value="Back Open Blouse">Back Open Blouse</option>
                  <option value="Katori Blouse">Katori Blouse</option>
                  <option value="Belt Blouse">Belt Blouse</option>
                  <option value="Boat Neck Blouse">Boat Neck Blouse</option>
                  <option value="V-Neck Blouse">V-Neck Blouse</option>
                  <option value="Halter Neck Blouse">Halter Neck Blouse</option>
                  <option value="Off-Shoulder Blouse">Off-Shoulder Blouse</option>
                  <option value="Collar Neck Blouse">Collar Neck Blouse</option>
                  <option value="Peter Pan Collar Blouse">Peter Pan Collar Blouse</option>
                  <option value="Sleeveless Blouse">Sleeveless Blouse</option>
                  <option value="Full-Sleeve Blouse">Full-Sleeve Blouse</option>
                  <option value="Three-Quarter Sleeve Blouse">Three-Quarter Sleeve Blouse</option>
                  <option value="Cap Sleeve Blouse">Cap Sleeve Blouse</option>
                  <option value="Asymmetrical Blouse">Asymmetrical Blouse</option>
                </>
              )}

              {formData.category === 'Aari Works' && (
                <>
                  <option value="Chain Stitch">Chain Stitch</option>
                  <option value="Reverse Chain Stitch">Reverse Chain Stitch</option>
                  <option value="Bullion Stitch">Bullion Stitch</option>
                  <option value="Bead Work">Bead Work</option>
                  <option value="Sequin Work">Sequin Work</option>
                  <option value="Mirror Work">Mirror Work</option>
                  <option value="Mixed Technique">Mixed Technique</option>
                </>
              )}

              {formData.category === 'Custom Orders' && (
                <>
                  <option value="Custom Design">Custom Design</option>
                  <option value="Personalized Order">Personalized Order</option>
                  <option value="Special Request">Special Request</option>
                </>
              )}
            </select>
          </div>


          {/* Price */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Price (₹)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F76B8A] bg-gray-50"
              required
            />
          </div>

          {/* Offer */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Offer (%)</label>
            <input
              type="number"
              name="offer_percent"
              value={formData.offer_percent}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F76B8A] bg-gray-50"
            />
          </div>

          {/* Stock */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F76B8A] bg-gray-50"
              required
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F76B8A] bg-gray-50 resize-none"
            required
          />
        </div>

        {/* Image Dropzone */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Product Image</label>
          <div
            {...getRootProps()}
            className={`w-full h-48 border-2 border-dashed rounded-lg flex justify-center items-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition ${isDragActive ? 'border-[#F76B8A] bg-pink-50' : 'border-gray-300'
              }`}
          >
            <input {...getInputProps()} />
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-40 object-contain"
              />
            ) : (
              <p className="text-sm text-gray-400">
                Click or drag an image to upload
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="w-full py-3 bg-[#F76B8A] text-white text-lg rounded-lg hover:bg-[#e35b79] transition"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
       </div>
    </div>
  );
}

export default UploadItems;
