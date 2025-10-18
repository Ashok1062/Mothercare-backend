const mongoose = require('mongoose');
const { Schema } = mongoose;

const patientSchema = new Schema({
  user: [{ type: Schema.Types.ObjectId, ref: 'user' }], 
  patientName: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true, enum: ['male', 'female', 'other'] },
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
    medicalHistory: { type: [String], default: [] },
    currentMedications: { type: [String], default: [] },
    allergies: { type: [String], default: [] },
    emergencyContact: {
        name: { type: String, required: true },
        phone: { type: Number, required: true },
        email: { type: String, required: true }
    },
    
    notes: { type: String },
    insuranceDetails: {
        provider: { type: String },
        policyNumber: { type: String },
        coverageDetails: { type: String }
    },
    primaryPhysician: { type: String },
    appointments: [{ type: Schema.Types.ObjectId, ref: 'appointment' }],
    labResults: [{ type: Schema.Types.ObjectId, ref: 'LabResult' }],
    billingInfo: [{ type: Schema.Types.ObjectId, ref: "billing" }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },

});
const Patient = mongoose.model('Patient', patientSchema);
module.exports = Patient;