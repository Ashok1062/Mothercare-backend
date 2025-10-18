const mongoose = require('mongoose');
const { Schema } = mongoose;

const doctorSchema = new Schema({
   user: [{ type: Schema.Types.ObjectId, ref: 'user', required: true }], 
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  contact: {
    phone: { type: Number, required: true },
    email: { type: String, required: true }
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pin: { type: Number, required: true }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  notes: { type: String },
  patients: [{ type: Schema.Types.ObjectId, ref: 'Patient' }],
  appointments: [{ type: Schema.Types.ObjectId, ref: 'appointment' }],
  qualifications: { type: [String], default: [] },
    experience: { type: Number, default: 0 },
    ratings: { type: Number, default: 0 },
    reviews: { type: [String], default: [] },
    availability: { type: String, enum: ['full-time', 'part-time', 'consultant'], default: 'full-time' },
    department: { type: String , enum: ['Cardiology', 'Neurology', 'Pediatrics','Dental','General'], default: 'General' },
    onCall: { type: Boolean, default: false },
    shiftTimings: { type: [String], default: [] }
});

const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;
