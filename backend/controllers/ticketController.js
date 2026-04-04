const Ticket = require('../models/Ticket');

const getTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.find().populate('userId', 'name email').sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) { next(err); }
};

const createTicket = async (req, res, next) => {
  try {
    const { title, description, client, status, priority } = req.body;
    if (!title)
      return res.status(400).json({ message: 'Title is required' });
    const ticket = await Ticket.create({ title, description, client, status, priority, userId: req.user._id });
    res.status(201).json(ticket);
  } catch (err) { next(err); }
};

const updateTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    res.json(ticket);
  } catch (err) { next(err); }
};

const deleteTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    res.json({ message: 'Ticket deleted' });
  } catch (err) { next(err); }
};

module.exports = { getTickets, createTicket, updateTicket, deleteTicket };
