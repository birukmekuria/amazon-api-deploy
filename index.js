const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_KEY);

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Success!",
  });
});

// Payment route
app.post("/payment/create", async (req, res) => {
  const { total } = req.body; // Use req.body instead of req.query
  console.log(`Payment request received. Total: ${total}`);

  try {
    if (total > 0) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency: "usd",
      });
      console.log("PaymentIntent:", paymentIntent);

      res.status(201).json({
        clientSecret: paymentIntent.client_secret,
      });
    } else {
      res.status(400).json({
        message: "Total must be greater than 0",
      });
    }
  } catch (error) {
    console.error("Error creating payment intent:", error.message);
    res.status(500).json({
      message: "Failed to create payment intent",
      error: error.message,
    });
  }
});

// Server listener
const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(
    `Amazon Server Running on PORT: ${PORT}, http://localhost:${PORT}`
  );
});
