const express = require('express');
require('dotenv').config();
const dbConnection = require('./config/dbConnection');
const userRouter = require('./routes/userRouter');
const patientRouter = require('./routes/patient');
const doctorRouter = require('./routes/doctor');
const appointmentRouter = require('./routes/appointment');
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3001;

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors());
// Connect to the database

app.use('/api/users', userRouter);
app.use('/api/patients', patientRouter);
app.use('/api/doctors', doctorRouter);
app.use('/api/appointments', appointmentRouter);


dbConnection();
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
