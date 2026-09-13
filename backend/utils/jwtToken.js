export const sendToken = (user, statusCode, res ) =>{
    const token = user.getJWTToken();
    // option for cookie
    const option = {
        // cookie exipre  in 2 days
        expires : new Date(Date.now() + Number(process.env.COOKIE_EXPIRE) * 24*60*60*1000),
        // cookie access from server
        httpOnly : true,
        sameSite:"lax",
        secure: false
    };
    res.status(statusCode)
    .cookie('token', token, option)
    .json({
        success : true,
        user,
        token
    });
};