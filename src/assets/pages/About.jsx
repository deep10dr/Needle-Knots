import React from 'react';

function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff0f3] to-[#fdecef] px-6 py-16 text-[#2D2D2D]">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-[#F76B8A] mb-8">About Aari Designs</h1>

        {/* Tagline */}
        <p className="text-lg md:text-xl text-center text-gray-700 leading-relaxed max-w-3xl mx-auto mb-12">
          Where <span className="font-semibold text-[#F76B8A]">heritage</span> meets <span className="font-semibold text-[#F76B8A]">modernity</span> — at Aari Designs, we craft ethnic stories through fabrics, stitches, and technology.
        </p>

        {/* Team Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Deepak Card */}
          <div className="relative group overflow-hidden rounded-3xl shadow-lg bg-white p-8 transition hover:shadow-2xl">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="Deepak"
              className="w-28 h-28 mx-auto rounded-full shadow mb-4"
            />
            <h3 className="text-2xl font-bold text-[#F76B8A] text-center">Deepak</h3>
            <p className="text-center text-gray-700 font-medium mt-1">R&D Developer</p>
            <p className="text-sm text-gray-600 text-center mt-4">
              Full-stack innovator and core engineer behind Aari Designs' digital transformation. Implements AI and automation to enhance customer experience and backend efficiency.
            </p>
          </div>

          {/* Rithanashri Card */}
          <div className="relative group overflow-hidden rounded-3xl shadow-lg bg-white p-8 transition hover:shadow-2xl">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135823.png"
              alt="Rithanashri"
              className="w-28 h-28 mx-auto rounded-full shadow mb-4"
            />
            <h3 className="text-2xl font-bold text-[#F76B8A] text-center">Rithanashri</h3>
            <p className="text-center text-gray-700 font-medium mt-1">Designer & Chairwoman</p>
            <p className="text-sm text-gray-600 text-center mt-4">
              Creative force and artistic lead, blending traditional embroidery techniques with modern aesthetics. Every stitch is a symbol of passion and heritage.
            </p>
          </div>
        </div>

        {/* Company Overview */}
        <div className="mt-16 bg-white shadow-md rounded-3xl p-8 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#F76B8A] mb-4">Our Philosophy</h2>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed">
            Aari Designs isn't just about clothing — it's about cultural storytelling. We blend
            handcrafted designs with modern tools to create exclusive collections that celebrate
            identity, elegance, and individualism. From intricate <strong>Aari work</strong> to
            custom-fit <strong>bridal blouses</strong>, every piece is made with love and purpose.
          </p>
        </div>

        {/* Footer Quote */}
        <p className="text-center text-gray-500 mt-12 text-sm italic">
          “Threading dreams into reality — one design at a time.”
        </p>
      </div>
    </div>
  );
}

export default About;
