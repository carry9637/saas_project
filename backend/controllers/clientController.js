const Client = require('../models/Client');

const getClients = async (req, res, next) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.json(clients);
  } catch (err) { next(err); }
};

const createClient = async (req, res, next) => {
  try {
    const { name, email, company, plan, status } = req.body;
    if (!name || !email || !company)
      return res.status(400).json({ message: 'Name, email, and company are required' });
    const exists = await Client.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Client with this email already exists' });
    const client = await Client.create({ name, email, company, plan, status });
    res.status(201).json(client);
  } catch (err) { next(err); }
};

const updateClient = async (req, res, next) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json(client);
  } catch (err) { next(err); }
};

const deleteClient = async (req, res, next) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json({ message: 'Client deleted' });
  } catch (err) { next(err); }
};

module.exports = { getClients, createClient, updateClient, deleteClient };
