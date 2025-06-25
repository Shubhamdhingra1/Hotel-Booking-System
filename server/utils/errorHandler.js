export const errorHandler = (err,req,res,next) => {
    const errStatus = err.status || 500;
    const errMessage = err.message || "Internal Server Error";
    res.status(errStatus).json({
        success: false,
        status: errStatus,
        message: errMessage,
        stack:err.stack 
    });
}