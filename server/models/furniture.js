const mongoose = require("mongoose");

const furnitureSchema = new mongoose.Schema({
  name: String,

  description: {
    summary: { type: String },
    description: { type: String },
   features: [{ type: String }],    
   whatIncluded: [{ type: String }], 
  },

  price: Number,

  thumbnail: {
    type: String,
    required: false,
  },

  colorOptions: [
    {
      color: { type: String, required: true },
      colorCode: { type: String, required: false },
      furnitureimages: { type: [String], required: true },
    },
  ],

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },

  sector: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sector",
    required: true,
  },

  productOverview: [
    {
      icon: { type: String, required: false },
      label: { type: String, required: true },
    },
  ],

  specifications: {
    specificationImage: { type: String }, 
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
    details: [ 
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
    enum: ["New Arrival", "Best Seller", "Featured", "Popular", "Recommended"],
    default: [],
  },
});

module.exports = mongoose.model("Furniture", furnitureSchema);
