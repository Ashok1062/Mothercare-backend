const mongoose = require("mongoose");
const { Schema } = mongoose;

const billingSchema = new Schema({
  patient: { type: Schema.Types.ObjectId, ref: "Patient", required: true }, // linked to Patient
  date: { type: Date, default: Date.now },

  services: [
    {
      description: { type: String, required: true }, // e.g. "X-Ray", "Consultation"
      amount: { type: Number, required: true }
    }
  ],

  totalBilled: { type: Number, required: true },
  totalPaid: { type: Number, default: 0 },
  outstandingBalance: { type: Number, required: true },

  paymentStatus: {
    type: String,
    enum: ["unpaid", "partially paid", "paid"],
    default: "unpaid"
  }
});

const billing = mongoose.model("billing", billingSchema);
module.exports = billing;
