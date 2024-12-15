import bcrypt from "bcrypt";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Sign-up route controller logic
export const signup = async (req, res) => {
    try {
        //destrucutre certain feilds for validation or other operations
        const { 
                username, 
                password, 
                confirmPassword, 
            } = req.body;

            if (!username || !password || !confirmPassword) {
                return res.status(400).json({ error: 'All fields are required' });
            }

            if (password !== confirmPassword) {
                return res.status(400).json({ error: 'Password and Confirm Password must match' });
            }

            if (await User.findOne({ username })) {
                return res.status(409).json({ error: 'Username already taken' });
            }

            const saltRounds = parseInt(process.env.SALT_ROUNDS) || 12;
            //replace password with hashed password     
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            req.body.password = hashedPassword;

            const newUser = await User.create(req.body);
            
            const token = jwt.sign(
                { 
                    _id: newUser._id, 
                    username: newUser.username 
                },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );
    
            res.status(200).json({ newUser, token });
        } catch (error) {
            console.error('Sign up error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };


//Sign-in route controller logic    
export const signin = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required"});
        }

        const user = await User.findOne({ username })
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" })
        }
        
        // creating a JWT token with the user's ID in the payload
        const token = jwt.sign(
            { _id: user._id, username: user.username }, //payload
            process.env.JWT_SECRET,
            { expiresIn: "7d"}
        );

        res.status(200).json({ user, token });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })

    }
};

export const signout = async (req, res) => {
    res.status(200).json({ message: "Signout sucessful" });
}