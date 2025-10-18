const express = require('express');
const router = express.Router();
const {createDoctor,getAllDoctors,getDoctorById,getDoctorByUser ,updateDoctor,deleteDoctor,getDoctorsByDepartment} = require('../controller/doctorController');
const authMiddleware = require('../Middleware/authMiddleware');

// router
router.post('/', authMiddleware(["doctor"]), createDoctor);
router.get('/', authMiddleware(["admin","doctor","patient"]), getAllDoctors);
router.get('/byUser/:user',authMiddleware(["doctor"]),getDoctorByUser)
router.get('/:id', authMiddleware(["admin","doctor","patient"]), getDoctorById);
router.put('/:id', authMiddleware(["doctor"]), updateDoctor);
router.delete('/:id', authMiddleware(["admin"]), deleteDoctor);
router.get('/department/:department', authMiddleware(["admin","doctor","patient"]), getDoctorsByDepartment);
module.exports = router;