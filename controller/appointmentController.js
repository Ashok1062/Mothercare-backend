const Appointment = require("../models/appointment");
const Patient = require("../models/patient");
const Doctor = require("../models/doctor");

// ✅ Create new appointment
const createAppointment = async (req, res) => {
  try {
    const { patientId, department, notes, status } = req.body;

    if (!patientId || !patientName || !department || !notes) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 🧠 Find patient by ID (NOT name)
    const foundPatient = await Patient.findById(patientId);
    if (!foundPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // ✅ Create appointment
    const newAppointment = await Appointment.create({
      patient: foundPatient._id, 
      department,
      notes,
      status: status || "Pending",
    });
    console.log("New appointment created:", newAppointment);
    // Add appointment reference to patient
    await Patient.findByIdAndUpdate(foundPatient._id, {
      $push: { appointments: newAppointment._id },
    });

    res.status(201).json({
      message: "Appointment created successfully",
      appointment: newAppointment,
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res
      .status(500)
      .json({ message: "Error creating appointment", error: error.message });
  }
};

// ✅ Get all appointments (Admin)
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patient", "patientName age gender contact")
      .populate("doctor", "name department");
    res.json(appointments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching appointments", error: error.message });
  }
};

// ✅ Get single appointment
const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const app = await Appointment.findById(id)
      .populate("patient", "patientName")
      .populate("doctor", "name department");

    if (!app) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json(app);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching appointment", error: error.message });
  }
};

// ✅ Get appointments for a specific doctor
const getAppointmentsByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const apps = await Appointment.find({ doctor: doctorId })
      .populate("patient", "patientName age gender contact")
      .populate("doctor", "name department");
    res.json(apps);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching doctor appointments", error: error.message });
  }
};

// ✅ Update appointment (status/time)
const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { doctor, appointmentDate, appointmentTime, status } = req.body;

    const updated = await Appointment.findByIdAndUpdate(
      id,
      { doctor, appointmentDate, appointmentTime, status },
      { new: true }
    )
      .populate("doctor", "name department")
      .populate("patient", "patientName");

    if (!updated) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({
      message: "Appointment updated successfully",
      appointment: updated,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating appointment", error: error.message });
  }
};

const getAppointmentsByPatientId = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch all appointments for this patient
    const appointments = await Appointment.find({ patient: id })
      .populate("doctor", "name department")
      .populate("patient", "patientName age gender")
      .sort({ appointmentDate: -1 });

    if (!appointments.length) {
      return res.status(404).json({ message: "No appointments found for this patient" });
    }
   
    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Server error fetching appointments", error });
  }
};

// ✅ Move appointment to another doctor
const moveAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { targetDoctorId } = req.body;

    // 🧠 Validate input
    if (!targetDoctorId) {
      return res.status(400).json({ message: "targetDoctorId is required" });
    }

    // 🔍 Find appointment
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // 🔍 Check doctor existence
    const doctor = await Doctor.findById(targetDoctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // ✅ Update appointment details
    appointment.doctor = doctor._id;
    appointment.department = doctor.department; // keep consistency
    appointment.status = "Pending"; // reset status
    appointment.updatedAt = new Date();

    await appointment.save();

    res.status(200).json({
      message: "Appointment moved successfully",
      appointment,
    });
  } catch (error) {
    console.error("Error moving appointment:", error);
    res.status(500).json({
      message: "Server error while moving appointment",
      error: error.message,
    });
  }
};

// ✅ Delete appointment
const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Appointment.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting appointment", error: error.message });
  }
};

module.exports = {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  getAppointmentsByDoctor,
  getAppointmentsByPatientId,
  updateAppointment,
  moveAppointment,
  deleteAppointment,
};
