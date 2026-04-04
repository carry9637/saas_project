const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    title:       { type: String, required: [true, 'Title required'], trim: true },
    description: { type: String, trim: true, default: '' },
    client:      { type: String, trim: true, default: '' },
    status:      { type: String, enum: ['Open', 'In Progress', 'Resolved'], default: 'Open' },
    priority:    { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
    userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ticket', ticketSchema);
