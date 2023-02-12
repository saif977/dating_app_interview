const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const bcrypt=require("bcrypt");
const {isEmail}=require("validator");

const userSchema=new Schema({
    name:{
        type:String,
        required:[true,"enter name"]
    },
    email:{
        type:String,
        unique:true,
        required:[true,"enter email"],
       // validate:[isEmail,"enter valid email"]
    },
    password:{
        type:String,
        minlength:[6,"enter password minimum of 6 chars"]
    },
},{timestamps:true});

userSchema.pre("save",async function(){
    try{
        console.log(this,"this");
        const salt=await bcrypt.genSalt();
        this.password=await bcrypt.hash(this.password,salt);
    }
    catch(err){
        console.log(err);
    }
})


// ==== STATUC FUNCTION TO CKECK LOGIN==========
userSchema.statics.login=async function({email,password}){
        const user=await this.findOne({email});
        if(!user)
        throw ("email hasn't signed up yet");
        const isPasswordCorrect=await bcrypt.compare(password,user.password);
        if(isPasswordCorrect)
        {
            const {password,...others}=user._doc;
            return others;
        }
        throw("wrong password");
}

module.exports=mongoose.model("users",userSchema);