import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

const HomePage = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const featuredProducts = [
        {
            id: 1,
            name: "NextGen Pro Laptop",
            price: 149999.99,
            description: "Ultra-thin, lightweight laptop with 16GB RAM and 1TB SSD",
            image: "/featuredproduct/laptop.jpg"
        },
        {
            id: 2,
            name: "SoundWave X3 Headphones",
            price: 699.99,
            description: "Noise-cancelling wireless headphones with 30-hour battery life",
            image: "/featuredproduct/headphone.jpg"
        },
        {
            id: 3,
            name: "UltraVision 4K Smart TV",
            price: 259999.99,
            description: "55\" 4K Smart TV with HDR and voice control",
            image: "/featuredproduct/tv.jpg"
        },
        {
            id: 4,
            name: "Fast Track Smart Watch",
            price: 1299.99,
            description: "Wireless charging pad with multi-device support",
            image: "/featuredproduct/smartwatch.jpg"
        }
    ];

    const categories = [
        { name: "Laptops ", icon: "💻" },
        { name: "Smartphones", icon: "📱" },
        { name: "Headphones", icon: "🎧" },
        { name: "TVs & Home Theater", icon: "📺" },
        { name: "Gaming", icon: "🎮" },
        { name: "Wearables", icon: "⌚" },
        { name: "Cameras", icon: "📷" },
        { name: "Smart Home", icon: "🏠" }
    ];

    const heroSlides = [
        {
            title: "Next-Gen Tech at Your Fingertips",
            description: "Discover the latest in electronics innovation",
            buttonText: "Shop Now",
            image: "/banner/bannerImgOne.webp"
        },
        {
            title: "Summer Sale",
            description: "Up to 40% off on selected items",
            buttonText: "View Deals",
            image: "/banner/bannerImgTwo.webp"
        },
        {
            title: "New Arrivals",
            description: "Be the first to experience cutting-edge technology",
            buttonText: "Explore",
            image: "/banner/bannerImgThree.webp"
        }
    ];

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
    };

    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 5000);

        // Clear interval on component unmount
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-[#D4C9BE] text-gray-800">
      {/* Header */}
      <header className="bg-[#D4C9BE] shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo & Brand */}
            <div className="flex items-center space-x-2">
              <img
                src="/GadgetNest.png"
                alt="GadgetNest Logo"
                className="w-8 h-8"
              />
              <span className="text-[#123458] text-3xl font-bold">GadgetNest</span>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex space-x-8 ml-32">
              <a href="#" className="text-gray-800 hover:text-teal-600 transition">Home</a>
              <a href="#" className="text-gray-800 hover:text-teal-600 transition">Shop</a>
              <a href="#" className="text-gray-800 hover:text-teal-600 transition">Deals</a>
              <a href="#" className="text-gray-800 hover:text-teal-600 transition">Support</a>
            </nav>

            {/* Search, Cart & User */}
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="text-gray-800 placeholder-black rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400 w-64"
                  style={{ backgroundColor: '#C9B194' }}
                />
                <span className="absolute right-4 top-2 text-gray-400">🔍</span>
              </div>

              {/* Cart Icon */}
              <button
                aria-label="Cart"
                className="text-2xl text-white px-3 py-2 rounded-full"
                style={{ backgroundColor: '#706D54' }}
              >
                🛒
              </button>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  aria-label="User"
                  className="text-2xl text-white px-3 py-2 rounded-full"
                  style={{ backgroundColor: '#706D54', zIndex: 20 }}
                  onClick={() => setDropdownOpen(!dropdownOpen)} // Toggle dropdown visibility
                >
                  👤
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg z-50 bg-[#C9B194]">
                    
                    <Link
                    to="/signin"
                    className="block px-4 py-2 text-[#123458] hover:bg-[#D4C9BE] transition-colors"
                    >
                    Sign In
                    </Link>
                    <Link
                    to="/signup"
                    className="block px-4 py-2 text-[#123458] hover:bg-[#D4C9BE] transition-colors"
                    >
                    Sign Up
                    </Link>

                    <Link
                    to="/profile"
                    className="block px-4 py-2 text-[#123458] hover:bg-[#D4C9BE] transition-colors"
                    >
                    Profile
                    </Link>
                  </div>
                )}
              </div>


            </div>
        </div>
    </div>
</header>


            {/* Hero Carousel */}
            <div className="relative overflow-hidden h-[500px] md:h-[90vh]">
                {heroSlides.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
                            }`}
                    >
                        <div className="absolute inset-0 bg-black opacity-50"></div>
                        <div className="relative h-full flex items-center justify-center">
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="relative z-10 text-center px-6 max-w-4xl">
                            <h1
                                className="text-4xl md:text-6xl font-bold mb-4"
                                style={{ color: index === 0 || index === 1 ? '#006A71' : '#FFFFFF' }}
>
                                {slide.title}
                            </h1>

                            <p
                                className={`text-xl md:text-2xl mb-8 ${
                                (slide.description === "Discover the latest in electronics innovation" ||
                                slide.description === "Up to 40% off on selected items")
                                ? ""
                                : "text-gray-200"
                            }`}
                            style={
                                (slide.description === "Discover the latest in electronics innovation" ||
                                slide.description === "Up to 40% off on selected items")
                                ? { color: "#006A71" }
                                : {}
                            }
                            >
                            {slide.description}
                            </p>

                                <button className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-full font-semibold text-lg transition transform hover:scale-105">
                                    {slide.buttonText}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 z-20"
                >
                    ←
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 z-20"
                >
                    →
                </button>
                <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2 z-20">
                    {heroSlides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`h-3 w-3 rounded-full ${index === currentSlide ? 'bg-teal-400' : 'bg-gray-400'
                                }`}
                        ></button>
                    ))}
                </div>
            </div>

            {/* Categories */}
            <section className="py-12 px-4">
                <div className="container mx-auto">
                <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: '#123458' }}>Shop by Category</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {categories.map((category, index) => (
                            <a
                            key={index}
                            href="#"
                            className="bg-indigo-800 bg-opacity-50 rounded-xl p-6 text-center hover:bg-indigo-700 transition transform hover:scale-105"
                            >
                            <div className="text-4xl mb-3">{category.icon}</div>
                            <h3 className="font-semibold text-[#123458]">{category.name}</h3>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-12 px-4 bg-indigo-900 bg-opacity-50">
                <div className="container mx-auto">
                <h2 className="text-3xl font-bold mb-8 text-center text-[#123458]">Featured Products</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featuredProducts.map((product) => (
                            <div key={product.id} className="bg-gradient-to-br from-indigo-800 to-purple-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-5">
                                    <h3 className="font-bold text-xl mb-2">{product.name}</h3>
                                    <p className="text-gray-300 text-sm mb-4">{product.description}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-teal-400 font-bold text-xl">Rs.{product.price}</span>
                                        <button className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition">
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-10">
                        <button className="bg-transparent border-2 border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-indigo-900 px-8 py-3 rounded-full font-semibold transition">
                            View All Products
                        </button>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-12 px-4">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-indigo-800 bg-opacity-30 p-6 rounded-xl text-center">
                            <div className="text-4xl mb-4 text-teal-400">🚚</div>
                            <h3 className="text-xl font-bold mb-2">Free Shipping</h3>
                            <p className="text-gray-300">On all orders over Rs.100</p>
                        </div>
                        <div className="bg-indigo-800 bg-opacity-30 p-6 rounded-xl text-center">
                            <div className="text-4xl mb-4 text-teal-400">🔄</div>
                            <h3 className="text-xl font-bold mb-2">Easy Returns</h3>
                            <p className="text-gray-300">30-day money back guarantee</p>
                        </div>
                        <div className="bg-indigo-800 bg-opacity-30 p-6 rounded-xl text-center">
                            <div className="text-4xl mb-4 text-teal-400">🔒</div>
                            <h3 className="text-xl font-bold mb-2">Secure Payments</h3>
                            <p className="text-gray-300">Protected by industry-leading encryption</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className="py-12 px-4" style={{ backgroundColor: '#123458' }}>
                <div className="container mx-auto max-w-4xl text-center">
                <h2 className="text-3xl font-bold mb-3 text-[#F1EFEC]">Stay Updated</h2>
                <p className="mb-6 text-[#F1EFEC]">Subscribe to our newsletter for exclusive deals and tech news</p>
                    <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
                    <input
                        type="email"
                        placeholder="Your email address"
                        className="px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-900 w-full md:w-96 bg-[#F1EFEC] placeholder-black"
                    />

                    <button className="bg-[#D4C9BE] hover:bg-[#c8bfb4] text-black px-6 py-3 rounded-full font-semibold transition">
                        Subscribe
                    </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#030303] text-gray-300 py-12 px-4">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                        <h3 className="text-[#80BCBD] text-2xl font-bold mb-4">GadgetNest</h3>
                            <p className="mb-4">Your destination for premium electronics and cutting-edge technology.</p>
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-300 hover:text-teal-400">📱</a>
                                <a href="#" className="text-gray-300 hover:text-teal-400">📘</a>
                                <a href="#" className="text-gray-300 hover:text-teal-400">🐦</a>
                                <a href="#" className="text-gray-300 hover:text-teal-400">📸</a>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white mb-4">Shop</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="hover:text-teal-400 transition">All Products</a></li>
                                <li><a href="#" className="hover:text-teal-400 transition">Deals</a></li>
                                <li><a href="#" className="hover:text-teal-400 transition">New Arrivals</a></li>
                                <li><a href="#" className="hover:text-teal-400 transition">Best Sellers</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white mb-4">Support</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="hover:text-teal-400 transition">Contact Us</a></li>
                                <li><a href="#" className="hover:text-teal-400 transition">FAQs</a></li>
                                <li><a href="#" className="hover:text-teal-400 transition">Shipping Info</a></li>
                                <li><a href="#" className="hover:text-teal-400 transition">Returns</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white mb-4">About</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="hover:text-teal-400 transition">Our Story</a></li>
                                <li><a href="#" className="hover:text-teal-400 transition">Blog</a></li>
                                <li><a href="#" className="hover:text-teal-400 transition">Careers</a></li>
                                <li><a href="#" className="hover:text-teal-400 transition">Privacy Policy</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-indigo-800 mt-10 pt-6 text-center text-sm">
                        <p>© 2025 TechPulse Electronics. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;