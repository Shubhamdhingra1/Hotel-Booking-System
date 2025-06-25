import Express from "express";
import { deleteUser, getCurrentMonthNewUserCount, getTotalUserCount, getUser, getUsers, updateUser } from "../controllers/user.js";
import { verifyAdmin, verifyToken, verifyUser } from "../utils/verification.js";
const router = Express.Router();

// router.get('/checkauthentication', verifyToken, (req, res, next) => {
//     res.send({ message: "Hello user, You're logged in successfully", user: req.user });
// });

// router.get('/checkuser/:id', verifyUser, (req, res, next) => {
//     res.send({ message: "Hello user, You're logged in and You can delete your account", user: req.user });
// });

// router.get('/checkadmin/:id', verifyAdmin, (req, res, next) => {
//     res.send({ message: "Hello Admin, You're logged in and You can delete any account", user: req.user });
// });

// READ All
router.get('/:access_token', verifyAdmin, getUsers); //Only admin can access all users

// READ One by Id
router.get('/userInfo/:access_token/:id', verifyUser, getUser);

// UPDATE
router.patch('/:access_token/:id', verifyUser, updateUser); //Only user can update it's account

// DELETE
router.delete('/:access_token/:id', verifyUser, deleteUser); //Only user can delete it's account



router.get('/totalusers/:access_token', verifyAdmin, getTotalUserCount);
router.get('/newusers/:access_token', verifyAdmin, getCurrentMonthNewUserCount);

export default router;