const express = require("express");
const router = express.Router();
const upload = require('../middlewares/upload');

const {
   createReturnPolicy,
   getAllReturnPolicies,
 
} = require("../controller/returnpolicyController");

router.get("/", getAllReturnPolicies);
router.post("/",upload.single("icon"),  createReturnPolicy);
;

module.exports = router;
