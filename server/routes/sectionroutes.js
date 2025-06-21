const express = require("express");
const router = express.Router();

const {
  getAllSections,
  createSection,
  
 
} = require("../controller/sectionController");

router.get("/", getAllSections);
router.post("/",  createSection);


module.exports = router;
