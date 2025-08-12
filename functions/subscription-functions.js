const functions = require('firebase-functions');
const admin = require('firebase-admin');
const stripe = require('stripe')(functions.config().stripe.secret_key);

// Create Stripe checkout session for premium subscription
exports.createCheckoutSession = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { userId, plan, priceId, trialDays } = data;

  try {
    const session = await stripe.checkout.sessions.create({
      customer_email: context.auth.token.email,
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: 'subscription',
      subscription_data: {
        trial_period_days: trialDays || 14,
        metadata: {
          userId: userId,
          plan: plan
        }
      },
      success_url: `${functions.config().app.url}/dashboard.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${functions.config().app.url}/dashboard.html`,
      metadata: {
        userId: userId,
        plan: plan
      }
    });

    return { url: session.url };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw new functions.https.HttpsError('internal', 'Failed to create checkout session');
  }
});

// Handle Stripe webhooks
exports.handleStripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = functions.config().stripe.webhook_secret;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionCancelled(event.data.object);
        break;
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).send('Webhook handler failed');
  }
});

async function handleCheckoutCompleted(session) {
  const userId = session.metadata.userId;
  const plan = session.metadata.plan;
  
  const subscription = await stripe.subscriptions.retrieve(session.subscription);
  
  await admin.firestore().collection('users').doc(userId).set({
    subscription: {
      tier: plan,
      status: 'active',
      stripeCustomerId: session.customer,
      stripeSubscriptionId: session.subscription,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      features: getPlanFeatures(plan),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }
  }, { merge: true });

  // Send welcome email
  await sendWelcomeEmail(userId, plan);
}

async function handleSubscriptionUpdated(subscription) {
  const userId = subscription.metadata.userId;
  
  await admin.firestore().collection('users').doc(userId).update({
    'subscription.status': subscription.status,
    'subscription.currentPeriodStart': new Date(subscription.current_period_start * 1000),
    'subscription.currentPeriodEnd': new Date(subscription.current_period_end * 1000),
    'subscription.updatedAt': admin.firestore.FieldValue.serverTimestamp()
  });
}

async function handleSubscriptionCancelled(subscription) {
  const userId = subscription.metadata.userId;
  
  await admin.firestore().collection('users').doc(userId).update({
    'subscription.status': 'cancelled',
    'subscription.cancelledAt': admin.firestore.FieldValue.serverTimestamp(),
    'subscription.features': getPlanFeatures('free')
  });
}

async function handlePaymentSucceeded(invoice) {
  const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
  const userId = subscription.metadata.userId;
  
  // Log successful payment
  await admin.firestore().collection('users').doc(userId)
    .collection('payments').add({
      amount: invoice.amount_paid,
      currency: invoice.currency,
      status: 'succeeded',
      invoiceId: invoice.id,
      paidAt: new Date(invoice.status_transitions.paid_at * 1000),
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
}

async function handlePaymentFailed(invoice) {
  const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
  const userId = subscription.metadata.userId;
  
  // Log failed payment
  await admin.firestore().collection('users').doc(userId)
    .collection('payments').add({
      amount: invoice.amount_due,
      currency: invoice.currency,
      status: 'failed',
      invoiceId: invoice.id,
      failedAt: new Date(),
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

  // Send payment failure notification
  await sendPaymentFailureEmail(userId);
}

function getPlanFeatures(plan) {
  const features = {
    free: ['basic-analytics', 'survey-collection', 'qr-codes'],
    premium: [
      'basic-analytics', 'survey-collection', 'qr-codes',
      'advanced-analytics', 'ai-insights', 'revenue-tracking',
      'competitive-analysis', 'predictive-analytics', 'custom-reports',
      'unlimited-exports', 'priority-support'
    ]
  };
  
  return features[plan] || features.free;
}

// Cancel subscription
exports.cancelSubscription = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { userId } = data;

  try {
    const userDoc = await admin.firestore().collection('users').doc(userId).get();
    const userData = userDoc.data();
    
    if (!userData.subscription?.stripeSubscriptionId) {
      throw new functions.https.HttpsError('not-found', 'No active subscription found');
    }

    await stripe.subscriptions.update(userData.subscription.stripeSubscriptionId, {
      cancel_at_period_end: true
    });

    await admin.firestore().collection('users').doc(userId).update({
      'subscription.cancelAtPeriodEnd': true,
      'subscription.updatedAt': admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    throw new functions.https.HttpsError('internal', 'Failed to cancel subscription');
  }
});

// Update payment method
exports.updatePaymentMethod = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { userId } = data;

  try {
    const userDoc = await admin.firestore().collection('users').doc(userId).get();
    const userData = userDoc.data();
    
    if (!userData.subscription?.stripeCustomerId) {
      throw new functions.https.HttpsError('not-found', 'No customer found');
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: userData.subscription.stripeCustomerId,
      return_url: `${functions.config().app.url}/dashboard.html`,
    });

    return { url: session.url };
  } catch (error) {
    console.error('Error creating billing portal session:', error);
    throw new functions.https.HttpsError('internal', 'Failed to create billing portal session');
  }
});

// Track usage for free tier limits
exports.trackUsage = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { userId, feature, amount = 1 } = data;
  const today = new Date().toDateString();

  try {
    const usageRef = admin.firestore()
      .collection('users').doc(userId)
      .collection('usage').doc(today);

    await usageRef.set({
      [feature]: admin.firestore.FieldValue.increment(amount),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    return { success: true };
  } catch (error) {
    console.error('Error tracking usage:', error);
    throw new functions.https.HttpsError('internal', 'Failed to track usage');
  }
});

// Get usage statistics
exports.getUsageStats = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { userId } = data;

  try {
    const usageSnapshot = await admin.firestore()
      .collection('users').doc(userId)
      .collection('usage')
      .orderBy('updatedAt', 'desc')
      .limit(30)
      .get();

    const usage = {};
    usageSnapshot.forEach(doc => {
      usage[doc.id] = doc.data();
    });

    return { usage };
  } catch (error) {
    console.error('Error getting usage stats:', error);
    throw new functions.https.HttpsError('internal', 'Failed to get usage stats');
  }
});

async function sendWelcomeEmail(userId, plan) {
  // Implementation would depend on your email service
  console.log(`Sending welcome email to user ${userId} for plan ${plan}`);
}

async function sendPaymentFailureEmail(userId) {
  // Implementation would depend on your email service
  console.log(`Sending payment failure email to user ${userId}`);
}