const doctor = require('../models/doctor');
const UserLogin = require("../models/user"); 

//  Create a new doctor (after user signup)
const createDoctor = async (req, res) => {
  try {
    const {  
        userId,name,specialization,contact,address,patients, appointments,qualifications,
      experience,ratings,reviews,availability,department,onCall,shiftTimings } = req.body;
    // Ensure user exists

    const user = await UserLogin.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } 

    const newDoctor = await doctor.create({
      user: userId,name,specialization, contact,address,patients, appointments,qualifications, experience, ratings,
        reviews,availability, department, onCall, shiftTimings
    });



    res.status(201).json({ message: "Doctor created successfully", doctor: newDoctor });
  } catch (error) {
    res.status(500).json({ message: "Error creating doctor", error: error.message });
  }
};
//  Get all doctors
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await doctor.find().populate({
        path: "user",
        select: "-password -role",
        strictPopulate: false  // prevent crash if missing
      })
    .populate({path :"Patient", select: "patentName age contact.number notes",strictPopulate: false});
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Error fetching doctors", error: error.message });
  }
};

// GET doctor by userId
const getDoctorByUser = async (req, res) => {
  try {
    const { user } = req.params;  //  get userId from params

    // Check if user exists
    const userId = await UserLogin.findById(user);
    if (!userId) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find doctor linked to this user
    const doctorData = await doctor.findOne({ user: userId })

    if (!doctorData) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json(doctorData);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//  Get doctor by ID
const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    const Doctor = await doctor.findById(id)

    if (!Doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json(Doctor);
  } catch (error) {
    res.status(500).json({ message: "Error fetching doctor", error: error.message });
  }
};
//  Update doctor
const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const Doctor = await doctor.findByIdAndUpdate(id, { ...updates }, { new: true });

    if (!Doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json({ message: "Doctor updated successfully", Doctor });
  } catch (error) {
    res.status(500).json({ message: "Error updating doctor", error: error.message });
  }
};
//  Delete doctor
const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const Doctor = await doctor.findByIdAndDelete(id);

    if (!Doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json({ message: "Doctor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting doctor", error: error.message });
  }
};

const getDoctorsByDepartment = async (req, res) => {
  try {
    const { department } = req.params;
    const doctors = await doctor.find({ department });
    res.status(200).json(doctors);
  } catch (error) {
    console.error("Error fetching doctors by department:", error);
    res.status(500).json({ message: "Failed to fetch doctors." });
  }
};

module.exports = {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  getDoctorByUser,
  getDoctorsByDepartment
};
