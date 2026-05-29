import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext'; 
import styles from '../ShopPage.module.scss';

const ProductCard = ({ product, index, addToCart }) => {
  const { isAuthenticated } = useAuth(); // Use useAuth hook
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (isAuthenticated) {
      addToCart(product); // Add product to cart if logged in
    } else {
      navigate('/login'); // Redirect to login if not logged in
    }
  };

  return (
    <motion.div
      className={styles.productCard}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <div className={styles.imageContainer}>
        <img src={product.image} alt={product.name} />
        <div className={styles.quickActions}>
          <motion.button
            className={styles.cartBtn}
            title="Add to Cart"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
          >
            <i className="fas fa-shopping-cart"></i> Add to Cart
          </motion.button>
        </div>
      </div>
      <div className={styles.productInfo}>
        <h3>{product.name}</h3>
        <div className={styles.priceRating}>
          <span className={styles.actualPrice}>₹{product.actualPrice}</span>
          <span className={styles.discountPrice}>₹{product.discountPrice}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;