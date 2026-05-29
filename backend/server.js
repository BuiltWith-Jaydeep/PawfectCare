const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Check STRIPE_SECRET_KEY is loaded
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('STRIPE_SECRET_KEY is not set in .env file!');
  process.exit(1);
} else {
  console.log('STRIPE_SECRET_KEY loaded successfully');
}

// Stripe with the secret key
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Import routes, middleware, and models
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const orderRoutes = require('./routes/order');
const consultationRoutes = require('./routes/consultation');
const groomingRoutes = require('./routes/grooming');
const dayCareRoutes = require('./routes/dayCare');
const adoptionRoutes = require('./routes/adoption');
const vaccinationRoutes = require('./routes/vaccination');
const subscriptionRoutes = require('./routes/subscription');
const webhookRoutes = require('./routes/webhook');
const authMiddleware = require('./middleware/auth');
const Order = require('./models/Order');

const app = express();

//  Set up webhook route with express.raw before express.json
app.use('/api/webhook', express.raw({ type: 'application/json' }), webhookRoutes);

//  Set up other middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// env
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://cppraja5722:REDACTED_DB_PASSWORD@animal-hospital-cluster.lfiac.mongodb.net/?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Register other routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/grooming', groomingRoutes);
app.use('/api/daycare', dayCareRoutes);
app.use('/api/adoption', adoptionRoutes);
app.use('/api/vaccinations', vaccinationRoutes);
app.use('/api/subscription', subscriptionRoutes);

// Payment route for e-commerce 
app.post('/api/payment/create-checkout-session', authMiddleware, async (req, res) => {
  try {
    const { cart } = req.body;

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ error: 'Cart is empty or invalid' });
    }

    const lineItems = cart.map(item => {
      if (!item.name || !item.discountPrice || !item.quantity) {
        throw new Error('Invalid cart item: missing name, price, or quantity');
      }

      return {
        price_data: {
          currency: 'inr',
          product_data: {
            name: item.name,
          },
          unit_amount: item.discountPrice * 100,
        },
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:3000/payment-success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:3000/checkout',
      metadata: {
        userId: req.user.id,
        cart: JSON.stringify(cart),
      },
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating Stripe Checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Confirm payment and save order for e-commerce 
app.get('/api/payment/confirm', async (req, res) => {
  const { session_id } = req.query;

  if (!session_id) {
    return res.status(400).json({ error: 'No session_id provided' });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['line_items'],
    });

    if (session.payment_status === 'paid') {
      const cart = JSON.parse(session.metadata.cart || '[]');
      const order = new Order({
        userId: session.metadata.userId,
        orderId: session.id,
        paymentIntentId: session.payment_intent,
        amount: session.amount_total / 100,
        currency: session.currency,
        status: 'completed',
        products: session.line_items.data.map((item, index) => ({
          productId: item.price.product,
          quantity: item.quantity,
          name: cart[index]?.name || item.description,
          price: cart[index]?.discountPrice || (item.amount_total / item.quantity / 100),
        })),
        createdAt: new Date(),
      });

      await order.save();
      console.log('Order saved to database:', order);
      res.json({ message: 'Payment confirmed and order stored!' });
    } else {
      res.status(400).json({ error: 'Payment not completed yet' });
    }
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ error: 'Failed to confirm payment' });
  }
});

// New route to fetch billing history for subscriptions
app.get('/api/payments/user/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;

    // Verify the userId matches the authenticated user
    if (req.user.id !== userId) {
      return res.status(403).json({ error: 'Unauthorized access to billing history' });
    }

    // Fetch Stripe subscriptions for the user
    const subscriptions = await stripe.subscriptions.list({
      customer: req.user.stripeCustomerId, 
      status: 'all', // Include active, past_due, canceled, etc.
    });

    if (!subscriptions.data.length) {
      return res.status(200).json([]); // No billing history
    }

    // Fetch payment intents for each subscription
    const billingHistory = await Promise.all(
      subscriptions.data.map(async (sub) => {
        const paymentIntents = await stripe.paymentIntents.list({
          customer: req.user.stripeCustomerId,
          limit: 100, // limit
        });

        return paymentIntents.data
          .filter(pi => pi.invoice && pi.status === 'succeeded') // Only successful payments
          .map(pi => ({
            date: new Date(pi.created * 1000).toISOString(), // Convert Unix timestamp to ISO
            amount: pi.amount / 100, // Convert cents to INR
          }));
      })
    );

    // Flatten and sort billing history by date (descending)
    const flattenedHistory = billingHistory.flat().sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json(flattenedHistory);
  } catch (error) {
    console.error('Error fetching billing history:', error);
    res.status(500).json({ error: 'Failed to fetch billing history' });
  }
});

// Basic health check route
app.get('/', (req, res) => {
  res.send('PawfectCare Backend is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ error: 'Something went wrong on the server' });
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
