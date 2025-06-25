import User from "../models/user.js";

// READ operation to fetch all users
export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        next(error);
    }
};

// READ operation to fetch a single user by ID
export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // const { password, isAdmin, ...otherDetails } = user;
        res.json(user);
    } catch (error) {
        next(error);
    }
};

// UPDATE operation
export const updateUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        next(error);
    }
};

// DELETE operation
export const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        next(error);
    }
};

export const getTotalUserCount = async (req, res, next) => {
    try {
        const count = await User.countDocuments({});
        res.json({ count });
    } catch (error) {
        next(error);
    }
}
export const getCurrentMonthNewUserCount = async (req, res, next) => {
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    try {
        const count = await User.countDocuments({
            createdAt: {
                $gte: startOfMonth,         // gte :: greater than or equal to
                $lte: currentDate            //lte :: less than or equal to
            }
        });
        res.json({ count });
    } catch (error) {
        next(error);
    }
}