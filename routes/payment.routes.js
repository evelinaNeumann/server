const express = require('express');
const router = express.Router();

const stripe = require('stripe')('sk_test_51NRxMIAJ0RHQyfzi4NnT6YrdyFi2d6xeiTa2dCz2gJqzOSsxKP4lz0DbBcyDT2az2RCbcVlaUNm3etKnEar9AZzO003ug0bRII');

router.post('/intent', async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    console.log('Received client_secret:', paymentIntent.client_secret);
    res.json({ paymentIntent: paymentIntent.client_secret });
  } catch (e) {
    res.status(400).json({
      error: e.message,
    });
  }
});

router.post('/payment', async (req, res) => {
  const { id, client_secret } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.confirm(id, { client_secret });
    console.log('Received client_secret:', client_secret);

    if (paymentIntent.status === 'succeeded') {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
});

module.exports = router;
