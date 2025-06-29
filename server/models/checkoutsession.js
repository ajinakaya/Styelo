const CheckoutSessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  cartItems: [{
    furniture: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Furniture"
    },
    quantity: Number,
    price: Number
  }],
  
  // Checkout form data
  shippingMethod: String,
  shippingAddress: {
    firstName: String,
    lastName: String,
    companyName: String,
    streetAddress: String,
    city: String,
    province: String,
    phone: String,
    email: String,
    additionalInfo: String
  },
  paymentMethod: String,
  
  // Calculated totals
  subtotal: Number,
  shippingCost: Number,
  total: Number,

  // Auto-expire after 1 hour
  expiresAt: {
    type: Date,
    default: Date.now,
    expires: 3600
  }
}, { 
  timestamps: true 
});
module.exports = mongoose.model("CheckoutSession", CheckoutSessionSchema);