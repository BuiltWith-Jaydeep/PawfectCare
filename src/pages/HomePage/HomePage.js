import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaCommentDots, FaPaw, FaCircle, FaArrowRight, FaEye, FaShoppingCart, FaStar } from 'react-icons/fa';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './HomePage.css';

const slides = [
  {
    title: 'Dog Walking Services',
    subtitle: ['The Premier Local Dog Walking & Pet Services', 'Company In Your City, Since 1990 Year!'],
    bg: 'hero-bg-1.jpg',
    cta: 'MAKE AN APPOINTMENT'
  },
  {
    title: 'Pet Grooming',
    subtitle: ['Professional Grooming Services', 'For Your Beloved Pets Since 1995'],
    bg: 'hero-bg-2.jpg',
    cta: 'BOOK GROOMING'
  },
  {
    title: 'Pet Boarding',
    subtitle: ['Safe & Comfortable Boarding', "Trusted Care While You're Away"],
    bg: 'hero-bg-3.jpg',
    cta: 'SCHEDULE STAY'
  }
];

const products = [
  {
    id: 1,
    name: 'Premium Dog Food',
    price: '₹1827',
    image: '/assets/products/dog-food.jpg',
    category: 'Food',
    rating: 4,
    sale: true,
  },
  {
    id: 2,
    name: 'Cat Scratching Post',
    price: '₹699',
    image: '/assets/products/cat-post.jpg',
    category: 'Accessories',
    rating: 5
  },
  {
    id: 3,
    name: 'Pet Grooming Kit',
    price: '₹5499',
    image: '/assets/products/grooming-kit.jpg',
    category: 'Grooming',
    rating: 4
  },
  {
    id: 4,
    name: 'Dog Leash Set',
    price: '₹1189',
    image: '/assets/products/leash-set.jpg',
    category: 'Accessories',
    rating: 3
  },
  {
    id: 5,
    name: 'Cat Tree House',
    price: '₹2564',
    image: '/assets/products/cat-tree.jpg',
    category: 'Furniture',
    rating: 5
  },
  {
    id: 6,
    name: 'Pet Carrier Bag',
    price: '₹2599',
    image: '/assets/products/carrier-bag.jpg',
    category: 'Travel',
    rating: 4
  },
  {
    id: 7,
    name: 'Dog Chew Toys',
    price: '₹169',
    image: '/assets/products/chew-toys.jpg',
    category: 'Toys',
    rating: 4
  },
  {
    id: 8,
    name: 'Pet Bed',
    price: '₹869',
    image: '/assets/products/pet-bed.jpg',
    category: 'Bedding',
    rating: 5
  },
  {
    id: 9,
    name: 'Automatic Feeder',
    price: '₹1199',
    image: '/assets/products/auto-feeder.jpg',
    category: 'Gadgets',
    rating: 3
  }
];

const wordVariants = {
  hidden: { opacity: 0, x: -40 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.3,
      duration: 1.2,
      type: 'spring',
      stiffness: 80,
      damping: 10
    }
  })
};

const slideVariants = {
  enter: (direction) => ({ x: direction > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction > 0 ? '-100%' : '100%', opacity: 0 })
};

const HomePage = () => {
  // Set up state for the active slide and login status
  const [[activeSlide, direction], setActiveSlide] = useState([0, 1]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if the user is logged in 
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Wrap pagination with useCallback for stability
  const paginate = useCallback((newDirection) => {
    setActiveSlide(([prevSlide, _]) => [
      (prevSlide + newDirection + slides.length) % slides.length,
      newDirection
    ]);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => paginate(1), 5000);
    return () => clearInterval(timer);
  }, [paginate]);

  const parseWords = (text) =>
    text.split(' ').map((word, i) => (
      <motion.span 
        key={i} 
        variants={wordVariants}
        custom={i}
        style={{ display: 'inline-block', marginRight: '0.4em' }}
      >
        {word}
      </motion.span>
    ));

  return (
    <div className="homepage">
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

      <div className="carousel-container">
        <AnimatePresence initial={false} custom={direction}>
          {slides.map((slide, index) =>
            activeSlide === index && (
              <motion.section
                key={index}
                className="hero-slide"
                style={{ backgroundImage: `url(/assets/images/${slide.bg})` }}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 1.2, ease: 'easeInOut' }}
                custom={direction}
              >
                <div className="slide-overlay">
                  <motion.div 
                    className="slide-content left-align"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                  >
                    <motion.div
                      className="title-container"
                      initial="hidden"
                      animate="visible"
                    >
                      <FaPaw className="paw-icon" />
                      <motion.h1>{parseWords(slide.title)}</motion.h1>
                    </motion.div>

                    <div className="subtitle-container">
                      {slide.subtitle.map((line, lineIndex) => (
                        <motion.p
                          key={lineIndex}
                          initial="hidden"
                          animate="visible"
                          custom={lineIndex + 1}
                          variants={wordVariants}
                        >
                          {parseWords(line)}
                        </motion.p>
                      ))}
                    </div>

                    {/* Wrap the CTA button with Link to navigate to /service */}
                    <Link to="/service" style={{ textDecoration: 'none' }}>
                      <motion.button
                        className="cta-button"
                        whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ 
                          opacity: 1,
                          y: 0,
                          transition: { delay: 1.5 } 
                        }}
                      >
                        {slide.cta}
                      </motion.button>
                    </Link>
                  </motion.div>
                </div>
              </motion.section>
            )
          )}
        </AnimatePresence>

        <div className="slide-indicators left-align">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === activeSlide ? 'active' : ''}`}
              onClick={() => setActiveSlide([index, index > activeSlide ? 1 : -1])}
            >
              <FaCircle />
            </button>
          ))}
        </div>
      </div>

      <motion.section 
        className="shop-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1 }}
      >
        <div className="shop-container">
          <div className="shop-header">
            <h2>Popular Pet Products</h2>
            <Link to="/shop" style={{ textDecoration: 'none' }}>
              <motion.button 
                className="view-all-btn"
                whileHover={{ x: 5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                View All Products <FaArrowRight />
              </motion.button>
            </Link>
          </div>

          <div className="products-grid">
            {products.map((product, index) => (
              <motion.div 
                key={product.id}
                className="product-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  <div className="product-actions">
                    <Link to="/shop" style={{ textDecoration: 'none' }}>
                      <motion.button 
                        className="quick-view"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaEye />
                      </motion.button>
                    </Link>
                    <Link to="/shop" style={{ textDecoration: 'none' }}>
                      <motion.button 
                        className="add-to-cart"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaShoppingCart />
                      </motion.button>
                    </Link>
                  </div>
                  {product.sale && <span className="sale-badge">Sale!</span>}
                </div>
                
                <div className="product-details">
                  <div className="product-meta">
                    <span className="category">{product.category}</span>
                    <div className="rating">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < product.rating ? 'filled' : ''} />
                      ))}
                    </div>
                  </div>
                  <h3>{product.name}</h3>
                  <div className="price">
                    {product.oldPrice && <span className="old-price">{product.oldPrice}</span>}
                    <span className="current-price">{product.price}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
};

export default HomePage;
