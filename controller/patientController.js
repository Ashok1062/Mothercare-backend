const Patient = require("../models/patient");
const UserLogin = require("../models/user"); 
const Billing = require("../models/billing");

//  Create a new patient (after user signup)
const createPatient = async (req, res) => {
  try {
    const { userId, patientName , age, gender, contact, address, medicalHistory, currentMedications, allergies, emergencyContact, notes } = req.body;

    // Ensure user exists
    const user = await UserLogin.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found, cannot create patient." });
    }

    const patient = await Patient.create({
      user: userId,
      patientName,
      age,
      gender,
      contact,
      address,
      medicalHistory,
      currentMedications, 
      allergies,
      emergencyContact,
      notes
    });

    res.status(201).json({ message: "Patient created successfully", patient });
  } catch (error) {
    res.status(500).json({ message: "Error creating patient", error: error.message });
  }
};

//  Get all patients
const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find()
      .populate("billingInfo")
      .populate("appointments");
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: "Error fetching patients", error: error.message });
  }
};

//  Get patient by ID
const getPatientById = async (req, res) => {
  try {
    const { patientId } = req.params;

    const patient = await Patient.findById(patientId)
      .populate("billingInfo")
      .populate("appointments");

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: "Error fetching patient", error: error.message });
  }
};
const getPatientByUser = async (req, res) => {
  try {
    const { user } = req.params;  //  get userId from params

    // Check if user exists
    const userId = await UserLogin.findById(user);
    if (!userId) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find doctor linked to this user
    const PatientData = await Patient.findOne({ user: userId }); 

    if (!PatientData) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json(PatientData);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//  Update patient
const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const patient = await Patient.findByIdAndUpdate(id, updates, { new: true });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json({ message: "Patient updated successfully", patient });
  } catch (error) {
    res.status(500).json({ message: "Error updating patient", error: error.message });
  }
};

//  Delete patient
const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await Patient.findByIdAndDelete(id);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json({ message: "Patient deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting patient", error: error.message });
  }
};

//  Create billing record for a patient
const createBillingForPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { services, totalPaid } = req.body;

    const totalBilled = services.reduce((sum, s) => sum + s.amount, 0);
    const outstandingBalance = totalBilled - (totalPaid || 0);

    const bill = await Billing.create({
      patient: patientId,
      services,
      totalBilled,
      totalPaid,
      outstandingBalance,
      paymentStatus:
        outstandingBalance === 0
          ? "paid"
          : totalPaid > 0
          ? "partially paid"
          : "unpaid"
    });

    // Attach bill to patient (array of ObjectIds)
    await Patient.findByIdAndUpdate(patientId, { $push: { billingInfo: bill._id } });

    res.status(201).json({ message: "Billing record created successfully", bill });
  } catch (error) {
    res.status(500).json({ message: "Error creating billing record", error: error.message });
  }
};

//  Update payment on a bill
const updateBillingPayment = async (req, res) => {
  try {
    const { billingId } = req.params;
    const { paymentAmount } = req.body;

    const bill = await Billing.findById(billingId);
    if (!bill) return res.status(404).json({ message: "Billing record not found" });

    bill.totalPaid += paymentAmount;
    bill.outstandingBalance = bill.totalBilled - bill.totalPaid;

    if (bill.outstandingBalance === 0) {
      bill.paymentStatus = "paid";
    } else if (bill.totalPaid > 0) {
      bill.paymentStatus = "partially paid";
    }

    await bill.save();

    res.json({ message: "Payment updated successfully", bill });
  } catch (error) {
    res.status(500).json({ message: "Error updating billing payment", error: error.message });
  }
};

module.exports = {
  createPatient,
  getAllPatients,
  getPatientById,
  getPatientByUser,
  updatePatient,
  deletePatient,
  createBillingForPatient,
  updateBillingPayment
};
