import {v2 as cloudinary} from "cloudinary"
// import { response } from "express";
import fs from "fs"

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
//   secure_distribution: 'mydomain.com',
//   upload_prefix: 'myprefix.com'
});

// for best handling of uploading use try ctach opertaion 

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null
        // upload the file on cloudinary
     const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        //file has been uploaded successfull
        // console.log("file is uploaded on cloudinary",response.url);
        fs.unlinkSync(localFilePath)
        return response
        
    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operatin got failed
        
        return null;
    }
}

export {uploadOnCloudinary}












// ese se bhi file upload ho jayegi simple bs url dena hoga
// cloudinary.v2.uploader
// .upload("dog.mp4", {
//   resource_type: "video", 
//   public_id: "my_dog",
//   overwrite: true, 
//   notification_url: "https://mysite.example.com/notify_endpoint"})
// .then(result=>console.log(result));




//// ye code chatgpt ka hai jisse error resolve hua hai

// import { v2 as cloudinary } from "cloudinary";
// import fs from "fs";

// cloudinary.config({ 
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
//   api_key: process.env.CLOUDINARY_API_KEY, 
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

// const uploadOnCloudinary = async (localFilePath) => {
//   try {
//     if (!localFilePath) return null;

//     const uploadResult = await cloudinary.uploader.upload(localFilePath, {
//       resource_type: "auto"
//     });

//     console.log("✅ Uploaded to Cloudinary:", uploadResult.url);
//     return uploadResult;

//   } catch (error) {
//     fs.unlinkSync(localFilePath); // clean up
//     console.error("❌ Cloudinary upload failed:", error);
//     return null;
//   }
// };

// export { uploadOnCloudinary };
