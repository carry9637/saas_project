const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    name:        { type: String, required: [true, 'Name required'], trim: true },
    description: { type: String, required: [true, 'Description required'], trim: true },
    price:       { type: Number, required: [true, 'Price required'], min: 0 },
    status:      { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
