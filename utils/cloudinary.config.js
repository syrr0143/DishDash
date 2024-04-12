import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv'
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        // upload the file 
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        // file has been uloaded successfully return response
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        // if file is not uploadedd sucessfully then we need to delete this fiel path as file path is currently on server and maybe it can be corrupted , for this purpose we use the fs unink method that is provided by the node
        fs.unlinkSync(localFilePath);  // this will remove the locally saved file as the upload got failed 
        console.log("error uploading file", error)
        return null;
    }
};

export { uploadOnCloudinary }