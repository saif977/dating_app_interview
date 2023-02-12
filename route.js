const express=require("express");
const router=express.Router();
const controller=require("./controller");
const multer=require("multer");

const diskStorage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"./images");
    },
    filename:(req,file,cb)=>{
        console.log(file);
        cb(null,Date.now()+file.originalname);
    }
})

const upload=multer({storage:diskStorage});


router.post("/register",controller.registerUser);
router.post("/login",controller.loginUser);
router.post("/postimage",upload.single("image"),controller.postImage);

module.exports=router;
