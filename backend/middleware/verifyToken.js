import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Ensure decoded contains the fields you expect
        if (!decoded._id) {
            return res.status(401).json({ error: 'Token payload invalid' });
        }

        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(401).json({ error: 'User not found or unauthorized' });
        }

        req.user = user; 
        next(); 
    } catch (error) {
        console.error('Authentication error:', error.message);
        return res.status(401).json({ error: 'Unauthorized' });
    }
};

export default verifyToken;




// import jwt from 'jsonwebtoken';
// import User from '../models/user.js';

// const verifyToken = async (req, res, next) => {
//     try {
//         const token = req.headers.authorization.split(' ')[1]; // Get token from header
//         const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify and decode

//         const user = await User.findById(decoded._id); // Find user by ID
//         if (!user) {
//             return res.status(401).json({ error: 'Unauthorized' });
//         }

//         req.user = user; // Add user to request object
//         next(); // Proceed to the next middleware/route handler
//     } catch (error) {
//         console.error('Authentication error:', error);
//         res.status(401).json({ error: 'Unauthorized' });
//     }
// };

// export default verifyToken;





//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//         return res.status(403).json({ error: 'Authorization token missing or malformed' });
//     }

//     const token = authHeader.split(' ')[1]; // Extract the token after "Bearer"

//     try {
//         // Verify the token and decode its payload
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         // Attach the decoded user information to the req object
//         req.user = {
//             id: decoded.id,       // Assuming the token contains the user ID as "id"
//             username: decoded.username, // Include other properties from the token if needed
//         };

//         // Call the next middleware or route handler
//         next();
//     } catch (error) {
//         console.error('Token verification failed:', error);
//         res.status(403).json({ error: 'Invalid or expired token' });
//     }
// };

// export default verifyToken;
