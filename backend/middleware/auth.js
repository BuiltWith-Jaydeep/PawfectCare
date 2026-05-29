const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Extract token from Authorization header (Bearer <token> format)
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.startsWith('Bearer ') 
    ? authHeader.replace('Bearer ', '') 
    : null;

  // Check if token is provided
  if (!token) {
    console.log('No token provided in request:', req.path); // Log the route for debugging
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    // Verify JWT_SECRET 
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined in environment variables');
      throw new Error('Server configuration error');
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(`Token verified successfully for user ID: ${decoded.id} on route: ${req.path}`); // Log success

    // Attach user ID to request object
    req.user = { id: decoded.id };

    // Proceed to next middleware
    next();
  } catch (error) {
    console.error('Token verification error:', error.message, 'on route:', req.path);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token has expired. Please log in again.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({ error: 'Invalid token provided.' });
    }
    return res.status(500).json({ error: 'Server error during token verification.' });
  }
};

module.exports = authMiddleware;