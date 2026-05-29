
import { motion } from 'framer-motion';
import styles from '../ShopPage.module.scss';

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'food', label: 'Pet Food' },
  { value: 'toys', label: 'Toys' },
  { value: 'clothes', label: 'Clothes' },
  { value: 'accessories', label: 'Accessories' },
];

const CategoryFilter = ({ selectedCategory, onSelect }) => {
  return (
    <motion.div 
      className={styles.categoryFilter}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h3>Categories</h3>
      <ul>
        {categories.map((category) => (
          <li
            key={category.value}
            className={`${styles.categoryItem} ${
              selectedCategory === category.value ? styles.active : ''
            }`}
            onClick={() => onSelect(category.value)}
          >
            {category.label}
            {selectedCategory === category.value && (
              <motion.span
                className={styles.indicator}
                layoutId="categoryIndicator"
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              />
            )}
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default CategoryFilter;