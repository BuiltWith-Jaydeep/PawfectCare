import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './ShopPage.module.scss';
import ProductCard from './Components/ProductCard';
import PriceFilter from './Components/PriceFilter';
import CategoryFilter from './Components/CategoryFilter';
import { useAuth } from '../../context/AuthContext';
import '@fortawesome/fontawesome-free/css/all.min.css';

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: [0, 3000],
    searchQuery: '',
  });
  const [cart, setCart] = useState([]);
  const { isAuthenticated, user } = useAuth(); // Add 'user' from useAuth
  const navigate = useNavigate();

  useEffect(() => {
    const sampleProducts = [
      { id: 1, name: 'Royal Canin Maxi Adult Dry Dog Food', actualPrice: 3000, discountPrice: 2700, category: 'food', image: require('./Assets/petfood01.jpg') },
      { id: 2, name: 'Drools ADULT OPTIMUM PERFORMANCE Chicken 20 kg Dry Adult Dog Food', actualPrice: 3100, discountPrice: 2800, category: 'food', image: require('./Assets/petfood02.jpg') },
      { id: 3, name: 'Pedigree Adult Chicken, Vegetable 1.2 kg Dry Adult Dog Food', actualPrice: 340, discountPrice: 290, category: 'food', image: require('./Assets/petfood03.jpg') },
      { id: 4, name: 'purepet Chicken and Vegetable 1 kg Dry Young Dog Food', actualPrice: 199, discountPrice: 170, category: 'food', image: require('./Assets/petfood04.jpg') },
      { id: 5, name: 'Active (2x1.2kg) Chicken and Vegetable 2.4 kg (2x1.2 kg) Dry Adult Dog Food', actualPrice: 399, discountPrice: 350, category: 'food', image: require('./Assets/petfood05.jpg') },
      { id: 6, name: 'Drools Small Breed Puppy, Premium Chicken 3 kg Dry New Born Dog Food', actualPrice: 999, discountPrice: 850, category: 'food', image: require('./Assets/petfood06.jpg') },
      { id: 7, name: 'Drools Absolute Milk Bone Jar- 40 Pieces Milk Dog Treat', actualPrice: 470, discountPrice: 400, category: 'food', image: require('./Assets/petfood07.jpg') },
      { id: 8, name: 'Royal Canin Shih Tzu Adult Food 1.5 kg Dry Adult Dog Food', actualPrice: 1800, discountPrice: 1600, category: 'food', image: require('./Assets/petfood08.jpg') },
      { id: 9, name: 'Royal Canin Beagle 3 kg Dry Adult Dog Food', actualPrice: 3000, discountPrice: 2700, category: 'food', image: require('./Assets/petfood09.jpg') },
      { id: 10, name: 'Hearty Oven-Baked Dry Food For Puppies With Chicken, Fish & Indian Herbs - All Breed', actualPrice: 500, discountPrice: 450, category: 'food', image: require('./Assets/petfood10.jpg') },
      { id: 11, name: 'Farmina N&D Pumpkin Lamb & Blueberry Grain Free Medium & Maxi Breed Dry Puppy Food', actualPrice: 1500, discountPrice: 1350, category: 'food', image: require('./Assets/petfood11.jpg') },
      { id: 12, name: "HUFT Sara's Wholesome Food - Grain-Free Lamb And Apple Dog Food", actualPrice: 800, discountPrice: 720, category: 'food', image: require('./Assets/petfood12.jpg') },
      { id: 13, name: 'NutriWag Balanced Meals With Chicken, Rice & Vegetables For Dog', actualPrice: 600, discountPrice: 540, category: 'food', image: require('./Assets/petfood13.jpg') },
      { id: 14, name: 'Orijen Biologically Appropriate Nutrition Dry Food For Dog - Small Breed', actualPrice: 2500, discountPrice: 2250, category: 'food', image: require('./Assets/petfood14.jpg') },
      { id: 15, name: 'Acana Light & Fit Adult Dog Food - All Breeds', actualPrice: 2000, discountPrice: 1800, category: 'food', image: require('./Assets/petfood15.jpg') },
      { id: 16, name: 'Kiki N Pooch Plush Toy for Dogs', actualPrice: 300, discountPrice: 250, category: 'toys', image: require('./Assets/pettoys01.jpg') },
      { id: 17, name: 'Pet Needs Chew Toy for Dogs', actualPrice: 200, discountPrice: 180, category: 'toys', image: require('./Assets/pettoys02.jpg') },
      { id: 18, name: 'Chullbull Pet Products Squeaky Toy for Dogs', actualPrice: 150, discountPrice: 120, category: 'toys', image: require('./Assets/pettoys03.jpg') },
      { id: 19, name: 'Active Rubber Ball for Dogs', actualPrice: 100, discountPrice: 80, category: 'toys', image: require('./Assets/pettoys04.jpg') },
      { id: 20, name: 'Pooch Box Rope Toy for Dogs', actualPrice: 250, discountPrice: 200, category: 'toys', image: require('./Assets/pettoys05.jpg') },
      { id: 21, name: 'Heads Up For Tails Tug Toy for Dogs', actualPrice: 180, discountPrice: 150, category: 'toys', image: require('./Assets/pettoys06.jpg') },
      { id: 22, name: 'Myntra Dog Toy Set', actualPrice: 400, discountPrice: 350, category: 'toys', image: require('./Assets/pettoys07.jpg') },
      { id: 23, name: 'Supertails Interactive Dog Toy', actualPrice: 220, discountPrice: 190, category: 'toys', image: require('./Assets/pettoys08.jpg') },
      { id: 24, name: 'Amazon Basics Dog Toy', actualPrice: 120, discountPrice: 100, category: 'toys', image: require('./Assets/pettoys09.jpg') },
      { id: 25, name: 'Flipkart Brand Dog Toy', actualPrice: 150, discountPrice: 130, category: 'toys', image: require('./Assets/pettoys10.jpg') },
      { id: 26, name: 'PetOBow Dog Toy', actualPrice: 200, discountPrice: 170, category: 'toys', image: require('./Assets/pettoys11.jpg') },
      { id: 27, name: 'Doggie Dabbas Dog Toy', actualPrice: 180, discountPrice: 150, category: 'toys', image: require('./Assets/pettoys12.jpg') },
      { id: 28, name: 'PawZ Dog Toy', actualPrice: 160, discountPrice: 140, category: 'toys', image: require('./Assets/pettoys13.jpg') },
      { id: 29, name: 'Trixie Dog Toy', actualPrice: 250, discountPrice: 220, category: 'toys', image: require('./Assets/pettoys14.jpg') },
      { id: 30, name: 'JW Pet Dog Toy', actualPrice: 300, discountPrice: 270, category: 'toys', image: require('./Assets/pettoys15.jpg') },
      { id: 31, name: 'Barks & Wags Dog Dress', actualPrice: 500, discountPrice: 400, category: 'clothes', image: require('./Assets/petcloth01.jpg') },
      { id: 32, name: 'Pet Needs Dog Sweater', actualPrice: 300, discountPrice: 250, category: 'clothes', image: require('./Assets/petcloth02.jpg') },
      { id: 33, name: 'Chullbull Pet Products Dog T-Shirt', actualPrice: 200, discountPrice: 150, category: 'clothes', image: require('./Assets/petcloth03.jpg') },
      { id: 34, name: 'Active Dog Raincoat', actualPrice: 400, discountPrice: 320, category: 'clothes', image: require('./Assets/petcloth04.jpg') },
      { id: 35, name: 'Pooch Box Dog Hat', actualPrice: 150, discountPrice: 120, category: 'clothes', image: require('./Assets/petcloth05.jpg') },
      { id: 36, name: 'Heads Up For Tails Dog Jacket', actualPrice: 600, discountPrice: 500, category: 'clothes', image: require('./Assets/petcloth06.jpg') },
      { id: 37, name: 'Myntra Dog Coat', actualPrice: 450, discountPrice: 380, category: 'clothes', image: require('./Assets/petcloth07.jpg') },
      { id: 38, name: 'Supertails Dog Vest', actualPrice: 350, discountPrice: 300, category: 'clothes', image: require('./Assets/petcloth08.jpg') },
      { id: 39, name: 'Amazon Basics Dog Sweater', actualPrice: 250, discountPrice: 200, category: 'clothes', image: require('./Assets/petcloth09.jpg') },
      { id: 40, name: 'Flipkart Brand Dog Dress', actualPrice: 300, discountPrice: 250, category: 'clothes', image: require('./Assets/petcloth10.jpg') },
      { id: 41, name: 'PetOBow Dog Scarf', actualPrice: 180, discountPrice: 150, category: 'clothes', image: require('./Assets/petcloth11.jpg') },
      { id: 42, name: 'Doggie Dabbas Dog Bandana', actualPrice: 120, discountPrice: 100, category: 'clothes', image: require('./Assets/petcloth12.jpg') },
      { id: 43, name: 'PawZ Dog Boots', actualPrice: 220, discountPrice: 190, category: 'clothes', image: require('./Assets/petcloth13.jpg') },
      { id: 44, name: 'Trixie Dog Coat', actualPrice: 550, discountPrice: 450, category: 'clothes', image: require('./Assets/petcloth14.jpg') },
      { id: 45, name: 'JW Pet Dog Sweater', actualPrice: 380, discountPrice: 320, category: 'clothes', image: require('./Assets/petcloth15.jpg') },
      { id: 46, name: 'Heads Up For Tails Dog Collar', actualPrice: 200, discountPrice: 150, category: 'accessories', image: require('./Assets/petacc01.jpg') },
      { id: 47, name: 'Pet Needs Dog Leash', actualPrice: 150, discountPrice: 120, category: 'accessories', image: require('./Assets/petacc02.jpg') },
      { id: 48, name: 'Chullbull Pet Products Dog Brush', actualPrice: 100, discountPrice: 80, category: 'accessories', image: require('./Assets/petacc03.jpg') },
      { id: 49, name: 'Active Dog Bed', actualPrice: 500, discountPrice: 400, category: 'accessories', image: require('./Assets/petacc04.jpg') },
      { id: 50, name: 'Pooch Box Dog Toy', actualPrice: 200, discountPrice: 160, category: 'accessories', image: require('./Assets/petacc05.jpg') },
      { id: 51, name: 'Myntra Dog Bowl', actualPrice: 180, discountPrice: 150, category: 'accessories', image: require('./Assets/petacc06.jpg') },
      { id: 52, name: 'Supertails Dog Harness', actualPrice: 300, discountPrice: 250, category: 'accessories', image: require('./Assets/petacc07.jpg') },
      { id: 53, name: 'Amazon Basics Dog Shampoo', actualPrice: 250, discountPrice: 200, category: 'accessories', image: require('./Assets/petacc08.jpg') },
      { id: 54, name: 'Flipkart Brand Dog Nail Clipper', actualPrice: 120, discountPrice: 100, category: 'accessories', image: require('./Assets/petacc09.jpg') },
      { id: 55, name: 'PetOBow Dog Water Bottle', actualPrice: 220, discountPrice: 190, category: 'accessories', image: require('./Assets/petacc10.jpg') },
      { id: 56, name: 'Doggie Dabbas Dog Food Storage', actualPrice: 350, discountPrice: 300, category: 'accessories', image: require('./Assets/petacc11.jpg') },
      { id: 57, name: 'PawZ Dog Grooming Kit', actualPrice: 400, discountPrice: 350, category: 'accessories', image: require('./Assets/petacc12.jpg') },
      { id: 58, name: 'Trixie Dog Car Seat Cover', actualPrice: 600, discountPrice: 500, category: 'accessories', image: require('./Assets/petacc13.jpg') },
      { id: 59, name: 'JW Pet Dog Training Clicker', actualPrice: 80, discountPrice: 70, category: 'accessories', image: require('./Assets/petacc14.jpg') },
      { id: 60, name: 'Barks & Wags Dog First Aid Kit', actualPrice: 280, discountPrice: 240, category: 'accessories', image: require('./Assets/petacc15.jpg') },
    ];
    setProducts(sampleProducts);
  }, []);

  const addToCart = (product) => {
    setCart(prevCart => [...prevCart, { ...product, quantity: 1 }]);
  };

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const totalActualPrice = cart.reduce((sum, item) => sum + item.actualPrice, 0);
  const totalDiscountPrice = cart.reduce((sum, item) => sum + item.discountPrice, 0);

  const filteredProducts = products.filter((product) => {
    const matchesCategory = filters.category === 'all' || product.category === filters.category;
    const matchesPrice =
      product.discountPrice >= filters.priceRange[0] && product.discountPrice <= filters.priceRange[1];
    const matchesSearch = product.name.toLowerCase().includes(filters.searchQuery.toLowerCase());
    return matchesCategory && matchesPrice && matchesSearch;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={styles.shopPage}
    >
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <nav className={styles.breadcrumb}>
              <Link to="/">Home</Link> / Shop
            </nav>
            <h1>Shop Now</h1>
            <p>Find the best deals!</p>
          </motion.div>
        </div>
      </div>

      <div className={styles.mainContent}>
        <motion.aside className={styles.filters} initial={{ x: -50 }} animate={{ x: 0 }}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Search products..."
              value={filters.searchQuery}
              onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
            />
          </div>
          <CategoryFilter
            selectedCategory={filters.category}
            onSelect={(cat) => setFilters({ ...filters, category: cat })}
          />
          <PriceFilter
            priceRange={filters.priceRange}
            onChange={(range) => setFilters({ ...filters, priceRange: range })}
          />
          {isAuthenticated && (
            <div className={styles.cartSection}>
              <h3>Your Cart</h3>
              {cart.length === 0 ? (
                <p>No items in cart</p>
              ) : (
                <>
                  <ul className={styles.cartList}>
                    {cart.map((item, idx) => (
                      <li key={item.id} className={styles.cartItem}>
                        <img src={item.image} alt={item.name} className={styles.cartItemImg} />
                        <span>{item.name} x {item.quantity || 1}</span>
                        <span>₹{item.discountPrice * (item.quantity || 1)}</span>
                        <motion.i
                          className="fas fa-trash-alt"
                          style={{ color: 'red', cursor: 'pointer', marginLeft: '10px' }}
                          whileHover={{ scale: 1.2 }}
                          onClick={() => removeFromCart(idx)}
                        />
                      </li>
                    ))}
                  </ul>
                  <div className={styles.cartTotal}>
                    <span className={styles.totalActual}>₹{totalActualPrice}</span>
                    <span className={styles.totalDiscount}>₹{totalDiscountPrice}</span>
                  </div>
                  {cart.length > 0 && (
                    <motion.button
                      className={styles.proceedBtn}
                      whileHover={{ scale: 1.05, rotate: 2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/checkout', { state: { cart, user } })}
                    >
                      Proceed to Buy
                    </motion.button>
                  )}
                </>
              )}
            </div>
          )}
        </motion.aside>

        <motion.div className={styles.productGrid} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {filteredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} addToCart={addToCart} />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ShopPage;