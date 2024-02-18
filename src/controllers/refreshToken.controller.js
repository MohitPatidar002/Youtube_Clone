
const asyncHandler = require('../utils/asyncHandler.js');
const ApiError = require('../utils/ApiError.js');
const User = require('../models/user.model.js');
const ApiResponse = require('../utils/ApiResponse.js');
const jwt = require('jsonwebtoken')


// generate refresh and access token
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


// refresh access token
const refreshAccessToken = asyncHandler( async (req, res) => {
    // access refresh token
    try {
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    
        if (!incomingRefreshToken) {
            throw new ApiError(401, "Unauthorized request")
        }
    
        // verify refresh token
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    
        // find user by id
        const user = await User.findById(decodedToken?._id)
    
        if(!user){
            throw new ApiError(401, "invalid refresh token");
        }
    
        // match the refresh token
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401, "Refresh token has expired or used")
        }
    
        // make a new refresh and access token
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshToken(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200,
                {accessToken, newRefreshToken},
                "Access token Refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message, "Access token refresh failed")
    }

})


module.exports = refreshAccessToken;