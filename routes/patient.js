// routes/patientRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../Middleware/authMiddleware");
const {createPatient, getAllPatients, getPatientById, getPatientByUser,updatePatient, deletePatient, createBillingForPatient, updateBillingPayment}= require("../controller/patientController");

// Patient CRUD
router.post("/", authMiddleware (["patient"]), createPatient);
router.get("/", authMiddleware (["admin"]), getAllPatients);
router.get("/:patientId", authMiddleware (["admin","doctor"]), getPatientById);
router.get("/byUser/:user", authMiddleware (["patient"]), getPatientByUser);
router.put("/:id", authMiddleware (["patient"]), updatePatient);
router.delete("/:id", authMiddleware (["admin"]), deletePatient);

// Billing routes
router.post("/:patientId/billing", authMiddleware (["admin"]), createBillingForPatient);
router.put("/billing/:billingId/payment", authMiddleware (["patient"]), updateBillingPayment);

module.exports = router;
