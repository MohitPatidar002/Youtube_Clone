const cloudinary = require('cloudinary');
const fs = require('fs');

          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET 
});


const uploadOnCloudinary = async (localFilePath) => {
    try{
        if(!localFilePath) return null;

        return await cloudinary.uploader.upload(localFilePath, {
            resource_type:"auto"
        })
    }
    catch(err){
        fs.unlinkSync(localFilePath)         // remove the temp file from local storage 
        return null;
    }
    
}

module.exports = uploadOnCloudinary;