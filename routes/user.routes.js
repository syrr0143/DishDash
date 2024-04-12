import express from 'express';
import { veriftJwt } from '../middleware/auth.middleware.js';
import { userLogin, userSignup, findAllUser, userProfile, updateUserDetails, deleteUser, userProfle, forgotPassword, resetPassword, logout, resetpasswordui } from '../controller/user.controller.js'
const router = express.Router();
import { upload } from '../middleware/multer.middleware.js'




// router.route('/signUp').post(userSignup);
router.route("/signUp").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }
    ]),
    userSignup);
router.route('/login').post(userLogin);
router.route('').get(veriftJwt, findAllUser);

//routes related to the specific users 
router.route('/profile')
    .get(veriftJwt, userProfile)
    .patch(veriftJwt, updateUserDetails)

router.route('/:id')
    .delete(veriftJwt, deleteUser)
    .get(veriftJwt, userProfle)
router.route('/forgot-password')
    .post(forgotPassword)

router.route('/reset-password/:id/:token')
    .get(resetpasswordui) // Render the password reset form
    .post(resetPassword)
router.route('/logout')
    .get(logout)

export default router;