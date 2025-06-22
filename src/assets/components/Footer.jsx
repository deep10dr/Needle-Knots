import React from 'react';

function Footer() {
  return (
    <footer className="bg-white text-gray-700 border-t border-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 text-sm">

        {/* Aari Collections */}
        <div>
          <h3 className="font-bold text-[#F76B8A] mb-4 uppercase">Aari Collections</h3>
          <ul className="space-y-2">
            <li><a href="" className="hover:underline">Designer Blouses</a></li>
            <li><a href="" className="hover:underline">Traditional Sarees</a></li>
            <li><a href="" className="hover:underline">Bridal Lehengas</a></li>
            <li><a href="" className="hover:underline">Custom Orders</a></li>
            <li><a href="" className="hover:underline">Kids Ethnic Wear</a></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="font-bold text-[#F76B8A] mb-4 uppercase">Company</h3>
          <ul className="space-y-2">
            <li><a  className="hover:underline cursor-pointer" onClick={()=>{window.location.href="/aboutus"}}>About Us</a></li>
            <li><a  className="hover:underline" onClick={()=>{window.location.href="/error"}}>Our Story</a></li>
            <li><a  className="hover:underline" onClick={()=>{window.location.href="/error"}}>Careers</a></li>
            <li><a  className="hover:underline" onClick={()=>{window.location.href="/error"}}>Our Designers</a></li>
            <li><a  className="hover:underline" onClick={()=>{window.location.href="/error"}}>Blog</a></li>
          </ul>
        </div>

        {/* Customer Support */}
        <div>
          <h3 className="font-bold text-[#F76B8A] mb-4 uppercase">Support</h3>
          <ul className="space-y-2">
            <li><a href="" className="hover:underline">Contact Us</a></li>
            <li><a href="" className="hover:underline">FAQs</a></li>
            <li><a href="" className="hover:underline">Returns & Refunds</a></li>
            <li><a href="" className="hover:underline">Shipping Info</a></li>
            <li><a href="" className="hover:underline">Track Order</a></li>
          </ul>
        </div>

        {/* App Downloads */}
        <div>
          <h3 className="font-bold text-[#F76B8A] mb-4 uppercase">Download App</h3>
          <div className="space-y-2">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Available_on_the_App_Store_(black)_SVG.svg/2560px-Available_on_the_App_Store_(black)_SVG.svg.png"
              alt="App Store"
              className="w-32"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/512px-Google_Play_Store_badge_EN.svg.png"
              alt="Google Play"
              className="w-36"
            />
          </div>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="font-bold text-[#F76B8A] mb-4 uppercase">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#"><img src="https://img.icons8.com/ios-filled/30/facebook-new.png" alt="FB" /></a>
            <a href="#"><img src="https://img.icons8.com/ios-filled/30/instagram-new.png" alt="Insta" /></a>
            <a href="#"><img src="https://img.icons8.com/ios-filled/30/twitter.png" alt="Twitter" /></a>
            <a href="#"><img src="https://img.icons8.com/ios-filled/30/youtube-play.png" alt="YouTube" /></a>
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="font-bold text-[#F76B8A] mb-4 uppercase">Stay Updated</h3>
          <form className="space-y-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border px-2 py-1 rounded text-sm"
            />
            <button className="bg-[#F76B8A] text-white px-4 py-1 rounded text-sm hover:bg-pink-600 transition">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 px-6 py-4 text-center text-xs text-gray-500">
        <p>100% handcrafted Aari products | Original designs guaranteed</p>
        <p>Easy returns within 14 days | Trusted by 10,000+ customers</p>
        <p className="mt-2">© {new Date().getFullYear()} Needle & Knots. Crafted with ❤️ in India.</p>
      </div>
    </footer>
  );
}

export default Footer;
