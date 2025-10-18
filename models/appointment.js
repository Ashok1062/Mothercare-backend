const mongoose = require('mongoose');
const { Schema } = mongoose;
const appointmentSchema = new Schema({
  patient: { type: Schema.Types.ObjectId, ref: 'Patient'  },
  doctor: { type: Schema.Types.ObjectId, ref: 'Doctor' },
    appointmentDate: { type: String },
  appointmentTime: { type: String },
    department: { type: String, required: true ,enum: ['Cardiology', 'Neurology', 'Pediatrics','Dental','General'], default: 'General' }, 
    notes: { type: String, default: '' , required: true },
    status: { type: String, enum: ['Pending', 'Confirmed', 'Canceled'], default: 'Pending' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const appointment = mongoose.model('appointment', appointmentSchema);
module.exports = appointment;
