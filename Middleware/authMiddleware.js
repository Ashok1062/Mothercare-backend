const jwt = require("jsonwebtoken");
const user = require("../models/user");

const authMiddleware = (allowedRoles = []) => { 
    return async (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer')) {
            return res.status(401).json({ message: 'Authorization header missing or malformed' });
        }
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const existingUser = await user.findById(decoded.userId).select('-password');
            if (!existingUser) {
                return res.status(401).json({ message: 'User not found' });
            }
            req.user = existingUser; // Attach user to request object
            if(allowedRoles.length === 0) {
                return next(); // No role restrictions, allow access
            }
            if(allowedRoles.length && !allowedRoles.includes(existingUser.role)) {
                return res.status(403).json({ message: 'Access forbidden: insufficient permissions' });
            }
            next();
        } catch (error) {
            console.error('Error in authMiddleware:', error);
            res.status(401).json({ message: 'Unauthorized' });
        }
    };
};

module.exports = authMiddleware;
