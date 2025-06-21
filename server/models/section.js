const mongoose = require("mongoose");

const SectionSchema = new mongoose.Schema(
  {
    section: {
      type: String,
      required: true,
      unique: true,
    },
     category: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Category",
          required: true,
        },
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Section", SectionSchema);
