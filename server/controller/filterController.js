const Furniture = require('../models/furniture');
const Category = require('../models/category');
const Section = require('../models/section');


const searchFurniture = async (req, res) => {
  try {
    const { search } = req.query;
    if (!search) return res.status(400).json({ error: 'Search query is required' });

    const categoryMatches = await Category.find({ name: { $regex: search, $options: 'i' } }).select('_id');
    const sectionMatches = await Section.find({ name: { $regex: search, $options: 'i' } }).select('_id');

    const results = await Furniture.find({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { category: { $in: categoryMatches.map(c => c._id) } },
        { section: { $in: sectionMatches.map(s => s._id) } }
      ]
    })
      .populate('category')
      .populate('section')
      .populate('returnPolicy');

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const filterFurniture = async (req, res) => {
  try {
    const {
      minPrice,
      maxPrice,
      color,
      tag,
      category,
      section,
      sortBy,
      sortOrder = 'asc',
    } = req.query;

    const filter = {};

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (color) filter.color = { $regex: color, $options: 'i' };
    if (tag) filter.tags = tag;
    if (category) filter.category = category;
    if (section) filter.section = section;

    const sortOptions = {};
    if (sortBy) sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const filtered = await Furniture.find(filter)
      .populate('category')
      .populate('section')
      .populate('returnPolicy')
      .sort(sortOptions);

    res.status(200).json(filtered);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getFurnitureByTag = async (req, res) => {
  try {
    const { tagName } = req.params;

    const furniture = await Furniture.find({ tags: tagName })
      .populate('category')
      .populate('section')
      .populate('returnPolicy');

    res.status(200).json(furniture);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  searchFurniture,
  filterFurniture,
  getFurnitureByTag,
};
