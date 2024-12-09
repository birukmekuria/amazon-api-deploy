const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const stripe = require("stripe");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Stripe
const stripeInstance = stripe(process.env.STRIPE_KEY);

app.use(cors({ origin: true }));
app.use(express.json());

// Health Check Route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Success!",
  });
});

// Create Payment Intent
app.post("/payment/create", async (req, res) => {
  try {
    const total = parseInt(req.query.total || req.body.total);

    // Validate total
    if (!total || total <= 0) {
      return res.status(400).json({
        message: "Total must be greater than 0",
      });
    }

    // Create Payment Intent
    const paymentIntent = await stripeInstance.paymentIntents.create({
      amount: total, // Amount in the smallest currency unit (cents)
      currency: "usd",
    });

    res.status(201).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

// Start the Server
app.listen(PORT, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Server is running on http://localhost:${PORT}`);
});
