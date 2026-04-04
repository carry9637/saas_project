const express = require("express");
const { getTickets, createTicket, updateTicket, deleteTicket } = require("../controllers/ticketController");
const { protect } = require("../middleware/auth");

const router = express.Router();
router.use(protect);
router.get("/", getTickets);
router.post("/", createTicket);
router.put("/:id", updateTicket);
router.delete("/:id", deleteTicket);

module.exports = router;
