const asyncHandler = require('../utils/asyncHandler.js');
const ApiError = require('../utils/ApiError.js');
const User = require('../models/user.model.js');
const uploadOnCloudinary = require('../utils/fileUpload.js')
const ApiResponse = require('../utils/ApiResponse.js');

// generate refresh and access token
// const generateAccessAndRefreshToken = async(userId) => {
//     try{
//         // find user and generate the tokens
//         const user = await User.findById(userId)
//         const accessToken = user.generateAccessToken();
//         const refreshToken = user.generateRefreshToken();

//         // put refresh token into db and save
//         user.refreshToken = refreshToken
//         await user.save({ validateBeforSave: false})


//         // return access and refresh token
//         return {accessToken, refreshToken}
//     }
//     catch(error){
//         throw new ApiError(500, "Something went wrong while generating Access and Refresh Token")
//     }
// }


const registerUser = asyncHandler( async (req, res) => {
    // get the user detail from frontend
    // validation - not empty any field
    // check user already registered by email
    // hash the password befor save the db
    // save the details into db
    // return success message if user created


    const {username, fullName, email, password} = req.body;
    
    // check the all field fillup correctly
    if(
        [username, fullName, email, password].some((field) => 
        field?.trim === "")
    ){
        throw new ApiError(400, 'All fields are required')
    }

    // check the email is correct format
    if(!email.includes('@')){
        throw new ApiError(400, "please provide correct email")
    }

    // check the user already exists
    const existedUser = await User.findOne({
        $or: [{email}, {username}]
    });

    if(existedUser){
        throw new ApiError(409, 'Email and username already exists');
    }

    // access files 
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // console.log('files local path', avatarLocalPath);
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files?.coverImage[0]?.path
    }

    if(!avatarLocalPath){
        throw new ApiError(400, 'profile photo is required')
    }


    // upload on cloud
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    // console.log('avatar url from cloudinary',avatar);

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    // console.log('coverImage url from cloudinary',coverImage);

    if(!avatar){
        throw new ApiError(500, 'Profile photo required')
    }

    const user = await User.create({
        username: username.toLowerCase(),
        fullName,
        email,
        password,
        avatar:avatar.url,
        coverImage:coverImage?.url || ""
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, 'server error while registering the user')
    }


    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Created Successfully")
    )
})







// Logout
const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user logged out successfully"))
})

module.exports = registerUser;
module.exports = logoutUser;