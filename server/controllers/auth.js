import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import { createError } from '../utils/createError.js';
import { signAccessToken } from '../utils/jwtToken.js';

export const register = async (req, res, next) => {
    var { username, password, email, ...otherDetails } = req.body;
    if (!(username && password && email))
        return next(createError(404, 'Please fill all the fields properly'));
    const salt = bcrypt.genSaltSync(10);
    password = bcrypt.hashSync(password);

    try {

        const existingUser = await User.findOne({ username });
        const userWithRegisteredEmail = await User.findOne({ email });

        if (existingUser)
            return next(createError(400, 'Username already in use'));

        if (userWithRegisteredEmail)
            return next(createError(400, 'Email already registered'));

        const user = new User({ username, password, email, ...otherDetails });
        await user.save();

        const access_token = await signAccessToken({ id: user._id, isAdmin: user.isAdmin });

        res.status(201).json({ message: 'User created successfully', userId: user._id, access_token: access_token, success: true });
    } catch (error) {
        next(error);
    }
};


export const login = async (req, res, next) => {


    try {
        let user = await User.findOne({ username: req.body.username });
        if (!user) {
            user = await User.findOne({ email: req.body.email });
            if (!user)
                return next(createError(404, 'User Not Found'));
        }

        if (!req.body.password)
            return next(createError(404, 'Password Required'));


        const isValidPassword = await bcrypt.compare(req.body.password, user.password);
        if (!isValidPassword)
            return next(createError(400, "Wrong Password"));

        const access_token = await signAccessToken({ id: user._id, isAdmin: user.isAdmin });

        res.status(201).json({ message: 'Logged in successfully', userId: user._id, access_token: access_token, success: true });

    } catch (error) {
        next(error);
    }
};
