const express = require('express');
const router = express.Router();
const {createAppointment,getAllAppointments,getAppointmentById,getAppointmentsByDoctor,getAppointmentsByPatientId,moveAppointment,updateAppointment,deleteAppointment} = require('../controller/appointmentController');
const authMiddleware = require('../Middleware/authMiddleware');
// router
router.post('/', authMiddleware(["admin","doctor","patient"]), createAppointment);
router.get('/', authMiddleware(["admin"]), getAllAppointments);
router.get('/:id', authMiddleware(["doctor","admin","patient"]), getAppointmentById);
// Doctor fetch own appointments
router.get("/doctor/:doctorId", authMiddleware(["doctor"]), getAppointmentsByDoctor);

// Doctor/Admin update
router.put("/:id", authMiddleware(["doctor", "admin"]), updateAppointment);
router.get("/patient/:id", authMiddleware(["patient","admin"]), getAppointmentsByPatientId);

// Admin move appointment
router.put("/move/:id", authMiddleware(["admin"]), moveAppointment);

router.delete('/:id', authMiddleware(["admin"]), deleteAppointment);
module.exports = router;