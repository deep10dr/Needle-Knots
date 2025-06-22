import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Items from '../components/Items';

// 👉 Data
const categories = {
  Blouses: [
    { name: 'Designer Blouse', image: '/blouse.png' },
    { name: 'Silk Blouse', image: 'https://www.kalkifashion.com/blogs/wp-content/uploads/2023/06/golden_sleeveless_blouse_in_satin_glam_gold_with_ruffle_sleeve_frill-sg148070_2_-_1_.jpeg' },
    { name: 'Daily Wear', image: 'https://www.kalkifashion.com/blogs/wp-content/uploads/2023/06/black_blouse_in_raw_silk_with_resham_and_cut_dana-sg100148_2_.jpeg' },
    { name: 'Embroidered Blouse', image: 'https://www.kalkifashion.com/blogs/wp-content/uploads/2023/06/aqua_green_and_grey_organza_blouse_with_elaborate_balloon_sleeves._online_-_kalki_fashion_sg70062_3_.jpg' },
    { name: 'Casual Blouse', image: 'https://www.kalkifashion.com/blogs/wp-content/uploads/2024/11/4-14.jpg' },
  ],
  Sarees: [
    { name: 'Kanchipuram', image: '/Untitled design.png' },
    { name: 'Cotton Saree', image: '/cotton.png' },
    { name: 'Party Wear', image: '/party.png' },
    { name: 'Georgette Saree', image: '/sample.png' },
    { name: 'Banarasi Silk', image: '/Banarasi Silk.png' },
  ],
  Lehengas: [
    { name: 'Bridal Lehenga', image: 'https://www.kalkifashion.com/blogs/wp-content/uploads/2025/05/10-4-1093x1536.jpg' },
    { name: 'Festive Lehenga', image: 'https://www.kalkifashion.com/blogs/wp-content/uploads/2025/05/9-5-1093x1536.jpg' },
    { name: 'Designer Lehenga', image: 'https://www.kalkifashion.com/blogs/wp-content/uploads/2025/05/6-8-729x1024.jpg' },
    { name: 'Mirror Work Lehenga', image: 'https://www.kalkifashion.com/blogs/wp-content/uploads/2025/05/4-9-1093x1536.jpg' },
  ],
  'Aari Works': [
    { name: 'Hand Embroidery', image: 'https://www.kalkifashion.com/blogs/wp-content/uploads/2024/04/Onion-Pink-Heavily-Embroidered-Bridal-Lehenga-Set-3-1093x1536.jpeg' },
    { name: 'Beaded Work', image: '/bead.png' },
    { name: 'Thread Work', image: '/thread.png' },
    { name: 'Zardosi Embroidery', image: 'https://www.kalkifashion.com/blogs/wp-content/uploads/2024/04/Gold-Hand-Embroidered-Bridal-Lehenga-Set-In-Organza-2-1093x1536.jpeg' },
  ],
  'Custom Orders': [
    { name: 'Tailor Made', image: '/tailor.png' },
    { name: 'Bulk Orders', image: '/bulk.png' },
    { name: 'Design Consultation', image: '/consulting.png' },
  ],
};


const offerBanners = {
  Blouses: 'https://img.freepik.com/free-vector/dollar-deals-offers-banner_1017-31787.jpg?w=740',
  Sarees: 'https://img.freepik.com/free-psd/discount-offer-40-off-promotion-banner-with-editable-text_47987-11947.jpg?w=740',
  Lehengas: 'https://img.freepik.com/free-psd/offers-sales-icon_23-2151964152.jpg?w=740',
  'Aari Works': 'https://img.freepik.com/free-psd/offers-sales-icon_23-2151964154.jpg?w=740',
  'Custom Orders': 'https://img.freepik.com/free-vector/mega-sale-offers-banner-template_1017-31299.jpg?w=740',
};

const categoryImages = {
  Blouses: '/blouse.webp',
  Sarees: 'saree.jpg',
  Lehengas: 'lehengas.jpg',
  'Aari Works': 'aari.jpg',
  'Custom Orders': 'custom.avif',
};

const topSelling = [
  { name: 'Designer Blouse', img: '/Designer Blouse.png', link: 'Blouses' },
  { name: 'Kanchipuram Saree', img: '/Untitled design.png', link: 'Sarees' },
  { name: 'Bridal Lehenga', img: '/lehenga.png', link: 'Lehengas' },
  { name: 'Beaded Work', img: '/beaded.png', link: 'Aari Works' },
];

function Home() {
  const [selectedCategory, setSelectedCategory] = useState('');

  // ✅ Safe category selector for NavBar & TopSelling
  const handleCategorySelect = (category) => {
    if (Object.keys(categories).includes(category)) {
      setSelectedCategory(category);
    } else {
      console.warn(`Invalid category: ${category}`);
    }
  };

  // ✅ Categories Grid
  const renderCategoryGrid = () => (
    <section className="mb-16">
      <h2 className="text-3xl md:text-5xl font-extrabold text-center text-pink-600 mb-20">
        Shop by Category
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
        {Object.keys(categories).map((cat) => (
          <div
            key={cat}
            className="bg-white rounded-2xl shadow-lg p-4 text-center hover:scale-105 transition-transform duration-300 cursor-pointer"
            onClick={() => handleCategorySelect(cat)}
          >
            <img
              src={categoryImages[cat]}
              alt={`${cat} Image`}
              className="mx-auto h-28 sm:h-20 mb-3 rounded-2xl object-cover"
            />
            <h3 className="text-base font-bold text-pink-600">{cat}</h3>
          </div>
        ))}
      </div>
    </section>
  );

  // ✅ Top Selling Cards
  const renderTopSelling = () => (
    <section className="mb-16 w-full">
      <h2 className="text-3xl md:text-5xl font-extrabold text-center text-pink-600 mb-20">
        Top Selling Items
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 place-items-center gap-4 md:gap-6">
        {topSelling.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg p-4 hover:scale-105 transition-transform duration-300 cursor-pointer w-full"
            onClick={() => handleCategorySelect(item.link)}
          >
            <img
              src={item.img}
              alt={item.name}
              className="w-full h-40 object-contain rounded-md mb-3"
            />
            <h3 className="text-base font-semibold text-gray-800">{item.name}</h3>
            <p className="text-sm text-gray-500">Most loved by customers</p>
          </div>
        ))}
      </div>
    </section>
  );

  // ✅ Offers
  const renderOffers = () => (
    <section className="mb-16">
      <h2 className="text-3xl md:text-5xl font-extrabold text-center text-pink-600 mb-20">
        Exciting Offers
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {Object.entries(offerBanners).map(([category, url]) => (
          <div
            key={category}
            className="rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300"
          >
            <img src={url} alt={`${category} Offer`} className="w-full h-48 object-cover" />
            <div className="bg-white p-4 text-center">
              <h3 className="text-lg font-bold text-pink-600">{category} Special Offer</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  // ✅ Items for selected category
  const renderCategoryItems = (categoryName) => (
 <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-3 place-items-center">
  {categories[categoryName]?.map((item, index) => (
    <div
      key={index}
      className="bg-white rounded-2xl shadow-md md:p-4 p-2 hover:scale-105 transition-transform duration-300 text-center w-max"
    >
      <img
        src={item.image}
        alt={item.name}
        className="w-full md:h-60 h-40 object-contain rounded-md mb-3"
      />
      <h3 className="text-base font-semibold text-gray-800">{item.name}</h3>
      <p className="text-sm text-gray-500">Top rated & trending</p>
    </div>
  ))}
</div>

  );

  return (
    <div className="bg-[#F8F1F1] min-h-screen w-full text-[#2D2D2D] scroll-smooth">
      {/* ✅ NavBar fixed */}
      <div className="fixed top-0 left-0 w-full z-50 shadow-md bg-white">
        <NavBar onCategorySelect={handleCategorySelect} />
      </div>

      {/* ✅ Content */}
      <div className="p-4 pt-28 md:pt-32">
        {!selectedCategory ? (
          <>
            <div className="flex w-full md:h-screen h-full shadow-2xl mb-10">
              <img
                src="/banner.gif"
                alt="Banner"
                className="object-contain h-full w-full"
              />
            </div>
            {renderCategoryGrid()}
            {renderTopSelling()}
            {renderOffers()}
            <Items />
          </>
        ) : (
          <>
            {renderCategoryItems(selectedCategory)}
            <Items paramCategory={selectedCategory} />
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Home;
