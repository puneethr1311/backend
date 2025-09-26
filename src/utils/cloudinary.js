import { v2 as cloudinary } from "cloudinary";
import fs from "fs"; // file system 

const uploadFromCloudinary = async (localFilePath)=>{
    try {
        if(!localFilePath) return null;
        //upload the file on cloudinary
        const res = await cloudinary.uploader.upload(localFilePath,{
          resource_type:"auto"
        });
        //file has been uploaded 
        console.log("file has been uploaded on cloudinary" ,res.url );

        return res;

    } catch (e) {
        fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation failed
        return null;

    }
}
export default uploadFromCloudinary;

cloudinary.config({
    cloud_name: "dgaxz73e4",
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
});