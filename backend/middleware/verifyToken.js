import jwt from 'jsonwebtoken';


/* decodes token and extracts payload, making the user ID
avavilable for use in subsequent routes */
export const verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]; //extract token from header
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded; //if valid, adds decoded user info to the request object

        next();
    } catch (error) {
        // 403 is forbidden status
        res.status(403).json({ error: "Invalid or expired token" });
    }
};

export default verifyToken;