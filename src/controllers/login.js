const asyncHandler = require('../utils/asyncHandler.js');
const ApiError = require('../utils/ApiError.js');
const User = require('../models/user.model.js');
// const uploadOnCloudinary = require('../utils/fileUpload.js')
const ApiResponse = require('../utils/ApiResponse.js');

const generateAccessAndRefreshToken = async(userId) => {
    try{
        // find user and generate the tokens
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // put refresh token into db and save
        user.refreshToken = refreshToken
        await user.save({ validateBeforSave: false})


        // return access and refresh token
        return {accessToken, refreshToken}
    }
    catch(error){
        throw new ApiError(500, "Something went wrong while generating Access and Refresh Token")
    }
}

const loginUser = asyncHandler ( async (req, res) => {
    // get the data
    // check if any blank field
    // check the user existance
    // check the password
    // access and refresh token generate 
    // send cookie(tokens)

    // fetch user data from body
    const {email, username, password} = req.body;

    // if username and email fields blank
    if(!(username || email)){
        throw new ApiError(400, "username or email is required")
    }

    // db check for user existence
    const user = await User.findOne({
        $or: [{email}, {username}]
    })

    // if user not found then throw error
    if(!user){
        throw new ApiError(404, "User not found")
    }

    // password compare
    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(401, "Password does not match")
    }

    // generate refresh and access tokens
    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)


    // option step for check user existence
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    // console.log(loggedInUser);
    // send cookies
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User Logged In Successfully"
        )
    )

})


module.exports = loginUser;