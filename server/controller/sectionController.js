const Section = require('../models/sector');

const createSection = async (req, res) => {
   try {
     const section = new Section(req.body); 
     await section.save();
     res.status(201).json(section); 
   } catch (error) {
     res.status(400).json({ error: error.message });
   }
 };

const getAllSections = async (req, res) => {
  try {
    const section = await Section.find().populate('category');
    res.json(section);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createSection,
  getAllSections,
};
