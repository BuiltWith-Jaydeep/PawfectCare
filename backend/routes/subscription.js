const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const authMiddleware = require('../middleware/auth');
const Subscription = require('../models/Subscription'); 

// Existing route to create a Stripe subscription checkout session
router.post('/create-checkout-session', authMiddleware, async (req, res) => {
  const { priceId } = req.body;

  if (!priceId) {
    return res.status(400).json({ error: 'Price ID is required' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/service`,
      metadata: {
        userId: req.user.id, // Use the real userId from authMiddleware
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating Stripe subscription session:', error);
    res.status(500).json({ error: 'Failed to create subscription session' });
  }
});

// New route to fetch a user's subscription from the database
router.get('/user/:userId', authMiddleware, async (req, res) => {
  const { userId } = req.params;

  // Ensure the authenticated user is requesting their own data
  if (req.user.id !== userId) {
    return res.status(403).json({ error: 'Unauthorized access to subscription data' });
  }

  try {
    // Query the Subscription model for the user's subscription
    const subscription = await Subscription.findOne({ userId });

    if (!subscription) {
      return res.status(404).json({ message: 'No subscription found for this user' });
    }

    res.status(200).json(subscription);
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({ error: 'Failed to fetch subscription data' });
  }
});

module.exports = router;