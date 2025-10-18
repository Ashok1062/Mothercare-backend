const user = require('../models/user');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const userRegister = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    // Check if user already exists
    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create new user
    const newUser = new user({
      username,
      email,
      password: hashedPassword,
      role
    });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const userLogin = async (req, res) => {
    const { email, password } = req.body;
  try {
    // Find user by email
    const existingUser = await user.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    // Check password
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    // Generate JWT token
    const token = jwt.sign({ userId: existingUser._id, username: existingUser.username, email: existingUser.email, role: existingUser.role }, process.env.JWT_SECRET, { expiresIn: '9h' });
    res.status(200).json({ message: 'Login successful', token , user: { id: existingUser._id, username: existingUser.username, email: existingUser.email, role: existingUser.role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
 
module.exports = { userRegister, userLogin };