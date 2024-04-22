import jwt from "jsonwebtoken";
import { User } from "../model/user.model.js";
import dotenv from 'dotenv';
import { uploadOnCloudinary } from '../utils/cloudinary.config.js'
import { sendEmail } from '../utils/nodemailer.utils.js'
dotenv.config();

const generateAccessToken = async (_id) => {
    try {
        const user = await User.findById(_id);
        if (!user) {
            throw new Error('User not found');
        }

        const accessToken = await user.generateAccessToken(_id);
        await user.save({ validateBeforeSave: false });
        return accessToken;
    } catch (error) {
        console.error('Error generating access token:', error);
        throw new Error('Error generating access token');
    }
}

async function resetToken(user) {
    try {
        // if user with given email is found , create a link that is valid for 15 minute only and is accessible only one time
        const secret = process.env.ACCESS_TOKEN_SECRET + user.password;
        const payload = {
            email: user.email,
            _id: user._id
        };
        const options = {
            expiresIn: '15m'
        };
        const resetToken = jwt.sign(payload, secret, options);
        return resetToken;
    } catch (error) {
        return res.status(500).json({ message: "internal server error ", error: error.message })
    }
}

const userSignup = async (req, res) => {
    try {
        const { name, email, password, roles } = req.body;
        if ([name, email, password].some((field) => field?.trim() === "")) {
            return res.status(400)
                .json({ message: "all fields are compulsory" });
        }
        const user = await User.findOne({ email: email });
        if (user) {
            console.log(`user found with same email ${email}`);
            return res.status(404)
                .json({ message: `user found with same email ${email} , please login instead` })
        }
        const avatarLocalPath = req.files?.avatar[0]?.path;
        console.log(avatarLocalPath)
        if (!avatarLocalPath) {
            return res.status(400).json({ message: "avatar file is required from local path" });
        }

        const avatar = await uploadOnCloudinary(avatarLocalPath);
        if (!avatar) {
            return res.status(400).json({ message: "avatar file is required to be uploaded successfully" });
        }
        const newuser = await User.create({ name, email, password, roles, avatar: avatar.url });

        const createdUser = await User.findById(newuser._id).select("-password -refreshToken");
        if (!createdUser) {
            return res.status(500)
                .json({ message: `something went wrong` });
        }
        sendEmail('signup', newuser);
        return res.status(201)
            .json({ message: `user signup successful`, user: newuser });


    } catch (error) {
        console.log(error)
        return res.status(500)
            .json({ message: `some error occured` })

    }
}
const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email, password)
        if ([email, password].some((field) => field?.trim() === "")) {
            return res.status(400)
                .json({ message: "all fields are compulsory" });
        }
        const user = await User.findOne({ email: email });
        console.log(user)
        if (!user) {
            console.log('no user found');
            return res.status(404)
                .json({ message: "no user found" })
        }
        const passwordMatch = await user.isPasswordCorrect(password);
        console.log(passwordMatch, 'user password emetered is ', password, `in db ${user.password}`)
        if (!passwordMatch) {
            console.log('password not matched');
            return res.status(401)
                .json({ message: "unauthorized access, wrong password entered" })
        }
        console.log('password matched');
        console.log(user)
        const accesstoken = await generateAccessToken(user._id);
        console.log(accesstoken)
        const userlogging = await User.findById(user._id).select("-password ");
        console.log(userlogging)
        const options = {
            httpOnly: true,
            secure: true
        }
        return res.status(200)
            .cookie("accesstoken", accesstoken, options)
            .json({ message: "password matched , login successful", user: userlogging, accesstoken: accesstoken })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "server errr ", error: error })
    }
}
const findAllUser = async (req, res) => {
    try {

        const users = await User.find();
        res.status(200).json({ message: "user fetched successfully", Users: users });
    } catch (error) {
        console.log('error', error)
    }
};

const userProfile = async (req, res) => {
    try {
        const userFromJwt = req.user;
        if (!userFromJwt) {
            return res.status(403).json({ message: 'access denied ' }); // 403 forbidden error 
        }
        const user = await User.findById(userFromJwt._id).select("-password -refreshToken");
        if (!user) {
            return res.status(404).json({ message: 'user not found ' }); // 404 not found error

        }
        return res.status(200).json({ message: "user profile fetched successfully", user: user });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "server error", error: error });
    }
}

const updateUserDetails = async (req, res) => {
    try {
        const userFromJwt = req.user;
        if (!userFromJwt) {
            return res.status(403).json({ message: 'access denied ' }); // 403 forbidden error 
        }
        const { name, avatar } = req.body;
        const user = await User.findByIdAndUpdate(userFromJwt._id, { name, avatar }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'user not found ' }); // 404 not found error
        }
        return res.status(200).json({ message: "user profile updated successfully", user: user });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "server error", error: error });
    }
}

// delete operation can only be performed by the admin 
const deleteUser = async (req, res) => {
    try {
        const UserFromJwt = req.user;
        const ifadmin = await User.findById(UserFromJwt._id);
        console.log('delete user roles', ifadmin)
        if (!UserFromJwt) {
            console.log('not a valid token');
            return res.status(403).json({ message: "access denied" });
        }
        console.log('user roles is', UserFromJwt.roles)
        if (ifadmin.roles !== 'admin') {
            console.log('not an admin');
            return res.status(403).json({ message: "access denied , you need to be an admin to perform this operation" });
        }
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        console.log('user deleted successfulyy');
        return res.status(200).json({ message: "user deleted successfully ", userdeleted: user })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "servere error during deletion operation" })
    }
}

const userProfle = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(403).json({ message: "access denied" });
        }
        const user = await User.findById(req.user._id).select("-password -refreshToken");
        if (!user) {
            return res.status(404).json({ message: 'user with the given details not found ' });
        }
        return res.status(200).json({ message: 'user profile fetched successfulyy', user: user })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "internal server error ", error: error.message });
    }
}

const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'email is required' });
        }
        // Let's make sure that the user exists for the given email
        const userfound = await User.findOne({ email: email });
        console.log(userfound)
        if (!userfound) {
            return res.status(404).json({ message: "user not found" });
        }
        const resetTokenGenerated = await resetToken(userfound);
        // Assuming resetToken() does not modify the user, update the user with the reset token and expiry
        const expiryTime = new Date();
        expiryTime.setMinutes(expiryTime.getMinutes() + 15); // Token expires in 15 minutes
        await User.findByIdAndUpdate(userfound._id, {
            resetPasswordToken: resetTokenGenerated,
            resetPasswordExpires: expiryTime
        });

        // Link format: http://localhost:3000/reset-password/{_id}/token
        const link = `${req.protocol}://${req.hostname}:4000/api/v1/user/reset-password/${userfound._id}/${resetTokenGenerated}`;
        let data = {
            resetpasswordLink: link,
            email: email,
            name: userfound.name
        }
        sendEmail('resetPassword', data);
        return res.status(200).json({ message: "password reset link sent successfully, expiry is 15 min", passwordResetLink: link })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "internal server error ", error: error.message });
    }
}
const resetpasswordui = async (req, res) => {
    try {
        // Render the password reset form
        res.send(`
        <h1>Password Reset</h1>
        <form action="api/v1/user/reset-password/${req.params.id}/${req.params.token}" method="POST">
            <label for="password">New Password:</label><br>
            <input type="password" id="password" name="password" required><br><br>
            <label for="confirmPassword">Confirm Password:</label><br>
            <input type="password" id="confirmPassword" name="confirmPassword" required><br><br>
            <input type="submit" value="Reset Password">
        </form>
        `);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}




const resetPassword = async (req, res) => {
    try {
        const { id, token } = req.params;
        if (!token) {
            return res.status(401).json({ message: 'unauthorised , no token found ' })
        }
        const { password, confirmPassword } = req.body;
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "passwords do not match" });
        }
        const user = await User.findOne({ resetPasswordToken: token });
        if (!user) {
            return res.status(404).json({ message: "password reset token is invalid" });
        }
        user.password = password;
        // Invalidate existing sessions or tokens
        user.sessions = []; // Assuming sessions are stored in an array
        // Update the password reset token
        user.resetPasswordToken = null;
        await user.save();
        return res.status(200).json({ message: "password reset successful, please login now" });
    } catch (error) {
        return res.status(500).json({ message: 'internal server error occured ', error: error.message })
    }
}


const logout = (req, res) => {
    try {
        res.clearCookie('accesstoken');
        res.status(200).json({ message: 'logged out successfully' });
    } catch (error) {
        return res.status(500).json({ message: "internal server error ", error: error.message })
    }
}

export { userLogin, userSignup, findAllUser, userProfile, updateUserDetails, deleteUser, userProfle, forgotPassword, resetPassword, logout, resetpasswordui };