const mongoose=require('mongoose');
const userSchema=new mongoose.Schema({

    username:{
        type:String,
        required:[true,"Please provide username"],        
    },
    email:{
        type:String,
        required:[true,"Please provide email"],
        unique:true,  
    },
    password:{
        type:String,
        required:[true,"Please provide password"],      
    },
    isAdmin:{
        type:Boolean,
        default:false,
    },
    Images:[

    ]
    
})
module.exports=mongoose.model("users",userSchema);