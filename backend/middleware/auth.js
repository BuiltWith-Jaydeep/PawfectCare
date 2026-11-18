const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * authMiddleware — answers "who are you?"
 *
 * Verifies the Bearer JWT, then loads the user from the database so that
 * `req.user.role` reflects the CURRENT stored role, not whatever a (possibly
 * stale or tampered) token claims. Downstream code must use `req.user.id`
 * for authorization, never a client-supplied id from params/body/query.
 *
 * Sets: req.user = { id, _id, role, email, username, stripeCustomerId }
 */
const authMiddleware = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.slice(7).trim()
    : null;

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined in environment variables');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Re-read the user so role changes/deletions take effect immediately.
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ error: 'Account no longer exists. Please log in again.' });
    }

    req.user = {
      id: String(user._id),
      _id: user._id,
      role: user.role || 'user',
      email: user.email,
      username: user.username,
      stripeCustomerId: user.stripeCustomerId,
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token has expired. Please log in again.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token provided.' });
    }
    console.error('Token verification error:', error.message, 'on route:', req.path);
    return res.status(500).json({ error: 'Server error during token verification.' });
  }
};

/**
 * requireAdmin — answers "may you?"
 *
 * MUST be mounted AFTER authMiddleware. Default-deny: anything that is not
 * explicitly role 'admin' is refused.
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    console.error('requireAdmin used without authMiddleware on route:', req.path);
    return res.status(500).json({ error: 'Server misconfiguration' });
  }
  if (req.user.role !== 'admin') {
    console.warn(`Admin access denied for user ${req.user.id} on ${req.method} ${req.path}`);
    return res.status(403).json({ error: 'Admin access required.' });
  }
  next();
};

module.exports = authMiddleware;
module.exports.authMiddleware = authMiddleware;
module.exports.requireAdmin = requireAdmin;
