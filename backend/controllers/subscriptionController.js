const Subscription = require('../models/Subscription');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Function to save subscription details
const saveSubscription = async (userId, subscriptionId, session) => {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const priceId = subscription.items.data[0].price.id;

    let planName, planDetails;
    switch (priceId) {
      case 'price_1R7UhrCKarIwe4RcC2ycP5Fa':
        planName = 'Basic Care Plan';
        planDetails = {
          veterinary: '1 video consultation/month',
          grooming: '1 basic bath/month (₹599 value)',
          boarding: 'None',
          vaccination: '10% discount on shots',
          adoption: 'Basic paperwork support',
          bonus: 'None',
        };
        break;
      case 'price_1R7UkZCKarIwe4RcCUQWWvvs':
        planName = 'Premium Care Plan';
        planDetails = {
          veterinary: '3 consultations (2 online + 1 clinic)',
          grooming: 'Full trim + bath monthly (₹1,257 value)',
          boarding: '24-hr stay credit/month (₹899 value)',
          vaccination: '25% discount + annual reminder',
          adoption: 'Priority shelter access',
          bonus: 'Free health checkup quarterly',
        };
        break;
      case 'price_1R7UmVCKarIwe4RcmKaaTIWJ':
        planName = 'Ultimate Care Plan';
        planDetails = {
          veterinary: 'Unlimited teleconsultations + 2 clinic visits',
          grooming: 'Premium spa grooming every 15 days',
          boarding: '3 daycare sessions/month (₹2,397 value)',
          vaccination: 'Full coverage package (₹2,300 value)',
          adoption: 'Dedicated concierge + certification',
          bonus: 'Free pet insurance consultation',
        };
        break;
      default:
        throw new Error('Unknown priceId');
    }

    const newSubscription = new Subscription({
      userId,
      paymentId: subscriptionId,
      plan: planName,
      planDetails,
      paymentDate: new Date(subscription.created * 1000), // Add paymentDate from Stripe
    });

    await newSubscription.save();
    console.log('Subscription saved to database:', newSubscription);
  } catch (error) {
    console.error('Error saving subscription:', error);
  }
};

module.exports = { saveSubscription };