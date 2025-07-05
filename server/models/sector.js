const mongoose = require("mongoose");

const SectorSchema = new mongoose.Schema(
  {
    sector: {
      type: String,
      required: true,
      
    },
     category: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Category",
          required: true,
        },
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sector", SectorSchema);
