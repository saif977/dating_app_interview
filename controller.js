const User = require("./model/user");
const { uploadImageToS3 } = require("./s3");
const jwt=require("jsonwebtoken");

const maxAge=3*24*60*60; 

const getJWTToken=(payLoad)=>jwt.sign(payLoad,process.env.JWT_SECRET_KEY,{expiresIn:maxAge});


const getErrorMssg=(err)=>{
    const errorObject={
        status:false
    };
    console.log(err);
    
  if (err === "wrong password") {
    errorObject.message = "wrong password";
  } else if (err === "email hasn't signed up yet") {
    errorObject.message = "email hasn't signed up yet";
  }

    console.log(err.errors);
    if(err._message==="users validation failed")
      Object.values(err.errors).forEach(({ properties }) => {
        errorObject[properties.path] = properties.message;
      });
    if(err.code===11000)
    errorObject.message="email already registered";
    return errorObject;
}


exports.postImage=async(req,res,next)=>{
    try{
        console.log(req.file);
        const result=await uploadImageToS3(req.file);
        console.log(result.path);
        res.json({"status":true,"link":result.path});
    }
    catch(err){
        console.log(err,"err");

    }
}

exports.registerUser=async (req,res,next)=>{
    try{
        console.log(req.body);
        const data={
            "name": req.body.name,
            "email":req.body.email,
            "password":req.body.password
        }
        const user=await User.create(data);
        const {password,...others}=user._doc;
        console.log(others);
        res.status(200).json({'status':true,user:others});
    }
    catch(err){
        const errMessage=getErrorMssg(err);
        res.status(404).json(errMessage);
    }
};

exports.loginUser=async (req,res,next)=>{
    try{
        const{email,password}=req.body;
        const user=await User.login({email,password});
        const jwtToken=getJWTToken({id:user._id});
        res.cookie("token",jwtToken,{httpOnly:true,maxAge});
        res.status(200).json(user);
    }
    catch(err){
        const errMessage=getErrorMssg(err);
        res.status(404).json(errMessage);
    }
}