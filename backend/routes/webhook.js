const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { saveSubscription } = require('../controllers/subscriptionController');
const Order = require('../models/Order');

// Write the order for a paid one-off checkout session. Idempotent: Stripe retries and
// duplicate deliveries are common, and orderId (= session id) is unique.
async function saveOrder(session) {
  const full = await stripe.checkout.sessions.retrieve(session.id, { expand: ['line_items'] });
  const cart = JSON.parse(full.metadata.cart || '[]');
  const products = full.line_items.data.map((item, index) => ({
    productId: item.price.product,
    quantity: item.quantity,
    name: cart[index]?.name || item.description,
    price: cart[index]?.discountPrice || (item.amount_total / item.quantity / 100),
  }));

  const result = await Order.updateOne(
    { orderId: full.id },
    {
      $setOnInsert: {
        userId: full.metadata.userId,
        orderId: full.id,
        paymentIntentId: full.payment_intent,
        amount: full.amount_total / 100,
        currency: full.currency,
        status: 'completed',
        products,
        createdAt: new Date(),
      },
    },
    { upsert: true }
  );
  return result.upsertedCount === 1;
}

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

  if (event.type === 'checkout.session.completed' && event.data.object.mode === 'payment') {
    const session = event.data.object;
    if (session.payment_status !== 'paid') {
      console.log(`Session ${session.id} completed but not paid yet; ignoring`);
    } else {
      try {
        const created = await saveOrder(session);
        console.log(created ? `Order ${session.id} saved` : `Order ${session.id} already recorded`);
      } catch (error) {
        // 500 makes Stripe retry delivery, so a paid order is not silently lost
        console.error('Error saving order:', error);
        return res.status(500).json({ error: 'Failed to save order' });
      }
    }
  } else if (event.type === 'checkout.session.completed') {
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