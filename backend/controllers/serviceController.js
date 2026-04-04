const Service = require('../models/Service');

const getServices = async (req, res, next) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (err) { next(err); }
};

const createService = async (req, res, next) => {
  try {
    const { name, description, price, status } = req.body;
    if (!name || !description || price === undefined)
      return res.status(400).json({ message: 'Name, description, and price are required' });
    const service = await Service.create({ name, description, price, status });
    res.status(201).json(service);
  } catch (err) { next(err); }
};

const updateService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (err) { next(err); }
};

const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json({ message: 'Service deleted' });
  } catch (err) { next(err); }
};

module.exports = { getServices, createService, updateService, deleteService };
