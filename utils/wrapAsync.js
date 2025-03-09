module.exports = (fn)=>{
    return (req,res,next)=>{  // This function work is to execute the fn function
        fn(req,res,next).catch((err)=>next(err));
    }
}