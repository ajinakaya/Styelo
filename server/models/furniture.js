const mongoose = require("mongoose");

const furniture = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
    thumbnail: {
    type: String,  
    required: false,
  },
  furnitureimages: [String],
   color: {
    type: [String],
    required: false,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  section: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Section",
    required: true,
  },
  productOverview: [
    {
      icon: {
        type: String,
        required: false,
      },
      label: {
        type: String,
        required: true,
      },
    },
  ],

  specifications: {
    dimensions: {
      overall: String,
      overallProductWeight: String,
      additionalDimensions: [
        {
          label: String,
          value: String,
        },
      ],
    },
    features: [
      {
        label: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
  },
  returnPolicy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ReturnPolicy",
    required: false,
  },

  tags: {
    type: [String],
    enum: ['New Arrival', 'Best Seller', 'Featured', 'Popular', 'Recommended'],
    default: [],
  },
});

module.exports = mongoose.model("Furniture", furniture);
