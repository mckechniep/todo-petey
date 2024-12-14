import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ error: 'Authorization token missing or malformed' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token after "Bearer"

    try {
        // Verify the token and decode its payload
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the decoded user information to the req object
        req.user = {
            id: decoded.id,       // Assuming the token contains the user ID as "id"
            username: decoded.username, // Include other properties from the token if needed
        };

        // Call the next middleware or route handler
        next();
    } catch (error) {
        console.error('Token verification failed:', error);
        res.status(403).json({ error: 'Invalid or expired token' });
    }
};

export default verifyToken;
