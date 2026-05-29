import { motion } from 'framer-motion';
import { FaDog } from 'react-icons/fa';

const InteractiveMascot = () => {
  return (
    <motion.div
      className="mascot"
      animate={{ y: [0, -20, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
      style={{ position: 'absolute', bottom: '20px', right: '20px' }}
    >
      <FaDog size="4em" color="#fff" />
    </motion.div>
  );
};

export default InteractiveMascot;
