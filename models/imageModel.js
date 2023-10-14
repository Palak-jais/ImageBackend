const mongoose=require('mongoose');
const ImageSchema=new mongoose.Schema({

    url:{
        type:String,
    },
    title:{
        type:String,
        required:[true,"Please provide email"], 
    },
    desc:{
        type:String,
        required:[true,"Please provide password"],      
    },
    likes:{
        type:Number,
        default:0     
    },
    viewed:{
        type:Number,
        default:0   
    }   
})
module.exports=mongoose.model("files",ImageSchema);