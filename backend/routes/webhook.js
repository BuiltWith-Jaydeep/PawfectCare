const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { saveSubscription } = require('../controllers/subscriptionController');

router.post('/', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('Webhook event received:', event.type, event.data.object.id); // Debug log

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata.userId;
    const subscriptionId = session.subscription;

    if (userId && subscriptionId) {
      try {
        await saveSubscription(userId, subscriptionId, session);
        console.log(`Subscription ${subscriptionId} saved for user ${userId}`);
      } catch (error) {
        console.error('Error saving subscription:', error);
      }
    } else {
      console.error('Missing userId or subscriptionId in session:', {
        userId,
        subscriptionId,
        sessionMetadata: session.metadata,
      });
    }
  } else {
    console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

module.exports = router;