const express = require("express");
const { getClients, createClient, updateClient, deleteClient } = require("../controllers/clientController");
const { protect } = require("../middleware/auth");

const router = express.Router();
router.use(protect);
router.get("/", getClients);
router.post("/", createClient);
router.put("/:id", updateClient);
router.delete("/:id", deleteClient);

module.exports = router;
