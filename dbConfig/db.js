const mongoose=require('mongoose');
module.exports=async()=>{
    try{
         mongoose.connect(process.env.MONGO_URL);
        const con=mongoose.connection;

        con.on('connected',()=>{
            console.log('connected sucessfull');
        })
        con.on('error',(err)=>{
            console.log('connection error mongodb'+err);
            process.exit();
        })

    }catch(error){
        console.log(error);
    }
}
