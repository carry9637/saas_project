const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema(
  {
    name:    { type: String, required: [true, 'Name required'], trim: true },
    email:   { type: String, required: [true, 'Email required'], unique: true, lowercase: true, trim: true },
    company: { type: String, required: [true, 'Company required'], trim: true },
    plan:    { type: String, enum: ['Starter', 'Pro', 'Enterprise'], default: 'Starter' },
    status:  { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Client', clientSchema);
