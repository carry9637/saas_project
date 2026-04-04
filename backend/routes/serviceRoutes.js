const express = require("express");
const { getServices, createService, updateService, deleteService } = require("../controllers/serviceController");
const { protect } = require("../middleware/auth");

const router = express.Router();
router.use(protect);
router.get("/", getServices);
router.post("/", createService);
router.put("/:id", updateService);
router.delete("/:id", deleteService);

module.exports = router;
