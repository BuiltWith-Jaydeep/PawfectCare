
import { useState } from 'react';
import { motion } from 'framer-motion';
import styles from '../ShopPage.module.scss';

const PriceFilter = ({ priceRange, onChange }) => {
  const [minPrice, setMinPrice] = useState(priceRange[0]);
  const [maxPrice, setMaxPrice] = useState(priceRange[1]);

  const handlePriceChange = (values) => {
    setMinPrice(values[0]);
    setMaxPrice(values[1]);
    onChange(values);
  };

  return (
    <motion.div 
      className={styles.priceFilter}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h3>Price Range</h3>
      <div className={styles.rangeContainer}>
        <input
          type="range"
          min={0}
          max={1000}
          value={minPrice}
          onChange={(e) => handlePriceChange([Number(e.target.value), maxPrice])}
          className={styles.rangeInput}
        />
        <input
          type="range"
          min={0}
          max={1000}
          value={maxPrice}
          onChange={(e) => handlePriceChange([minPrice, Number(e.target.value)])}
          className={styles.rangeInput}
        />
      </div>
      <div className={styles.priceDisplay}>
        <span>₹{minPrice}</span>
        <span>₹{maxPrice}</span>
      </div>
    </motion.div>
  );
};

export default PriceFilter;