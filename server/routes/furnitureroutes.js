const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const furnitureController = require('../controller/furnitureController');
const filterController = require('../controller/filterController');


router.post(
  '/',
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'furnitureimages', maxCount: 15 },
    { name: 'productIcons', maxCount: 10 },
  ]),
  furnitureController.createFurniture
);

// Update furniture
router.put(
  '/:id',
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'furnitureimages', maxCount: 10 },
    { name: 'productIcons', maxCount: 10 },
  ]),
  furnitureController.updateFurniture
);

router.delete('/:id', furnitureController.deleteFurniture);

router.get('/all', furnitureController.getAllFurniture);

router.get('/search', filterController.searchFurniture);

router.get('/filter', filterController.filterFurniture);

router.get('/tag/:tagName', filterController.getFurnitureByTag);
router.get('/:id', furnitureController.getFurnitureById);

module.exports = router;
