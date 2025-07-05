
// Create Furniture
const Furniture = require("../models/furniture");

const createFurniture = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      colorOptions,
      category,
      sector,
      productOverview,
      specifications,
      returnPolicy,
      tags,
    } = req.body;

    // File fields
    const thumbnail = req.files?.thumbnail?.[0]?.path || null;
    const productIconPaths = req.files?.productIcons?.map(file => file.path) || [];
    const allFurnitureImages = req.files?.furnitureimages?.map(file => file.path) || [];

    const parsedColorVariants = JSON.parse(colorOptions || "[]");
   
    const processedColorVariants = parsedColorVariants.map((variant, index) => {
      const imagesPerVariant = Math.ceil(allFurnitureImages.length / parsedColorVariants.length);
      const startIndex = index * imagesPerVariant;
      const endIndex = startIndex + imagesPerVariant;
      const variantImages = allFurnitureImages.slice(startIndex, endIndex);
      
      return {
        color: variant.color,
        colorCode: variant.colorCode || null,
        furnitureimages: variantImages
      };
    });

    const parsedOverview = JSON.parse(productOverview || "[]").map((item, index) => ({
      label: item.label,
      icon: productIconPaths[index] || null,
    }));

    const furniture = new Furniture({
      name,
      description,
      price,
      thumbnail,
      colorOptions: processedColorVariants, 
      category,
      sector,
      productOverview: parsedOverview,
      specifications: JSON.parse(specifications || "{}"),
      returnPolicy,
      tags: JSON.parse(tags || "[]"),
    });

    await furniture.save();
    res.status(201).json({ message: "Furniture created successfully", furniture });
  } catch (error) {
    console.error("Error creating furniture:", error);
    res.status(500).json({ error: error.message });
  }
};


// Get All Furniture
const getAllFurniture = async (req, res) => {
  try {
    const furniture = await Furniture.find().populate("category sector returnPolicy");
    res.json(furniture);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Furniture by ID
const getFurnitureById = async (req, res) => {
  try {
    const furniture = await Furniture.findById(req.params.id)
      .populate('category')
      .populate('sector')
      .populate('returnPolicy');
    if (!furniture) return res.status(404).json({ message: 'Furniture not found' });
    res.json(furniture);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Furniture
const updateFurniture = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Furniture.findById(id);
    if (!existing) return res.status(404).json({ message: "Furniture not found" });

    const data = req.body;

    for (let field of ["name", "description", "price", "category", "sector", "returnPolicy"]) {
      if (data[field]) existing[field] = data[field];
    }

    if (data.color) existing.color = JSON.parse(data.color);
    if (data.tags) existing.tags = JSON.parse(data.tags);
    if (data.specifications) existing.specifications = JSON.parse(data.specifications);

    // Handle images
    if (req.files?.thumbnail?.[0]) existing.thumbnail = req.files.thumbnail[0].path;
    if (req.files?.furnitureimages?.length)
      existing.furnitureimages = req.files.furnitureimages.map(f => f.path);

    // Handle productOverview with icons
    if (data.productOverview) {
      const overview = JSON.parse(data.productOverview);
      const icons = req.files?.productIcons || [];
      existing.productOverview = overview.map((item, i) => ({
        label: item.label,
        icon: icons[i]?.path || existing.productOverview?.[i]?.icon || null,
      }));
    }

    await existing.save();
    res.json({ message: "Furniture updated", furniture: existing });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: err.message });
  }
};


// Delete Furniture
const deleteFurniture = async (req, res) => {
  try {
    const deleted = await Furniture.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Furniture not found' });
    res.json({ message: 'Furniture deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createFurniture,
  getAllFurniture,
  getFurnitureById,
  updateFurniture,
  deleteFurniture,
};
