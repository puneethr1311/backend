// // this is done by try catch method 
// const asyncHandler =(fn)=>async (error,req,res,next)=>{
//     try {
//         await fn(req,res,next);
//     } catch (error) {
//         res.status(error.code || 500)
//         .json({success:false,
//             message:error.message
//         })
//     }
// }
// export default asyncHandler ;
// this is wrapper function that is used almost everywhere , that is built in utils


// now , this is done by promises 

const asyncHandler=(requestHandler)=>{
    return (req,res,next) =>{
        Promise.resolve(requestHandler(req,res,next)).reject((err)=>next(err));
    }
}
export default asyncHandler;