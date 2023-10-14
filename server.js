const express=require('express');
const cors=require('cors');
const bodyParser=require('body-parser');
const bcrypt =require('bcrypt');
const app=express();
const session = require('express-session');
const cookieParser=require('cookie-parser');
const User=require('./models/userModel.js');
const Image=require('./models/imageModel.js');
const connect=require('./dbConfig/db.js');

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
require('dotenv').config();
app.use(cookieParser())
app.use(session({
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:false,
    cookie:{
      expires:600000
    }
    }));
    connect();


app.get('/getdata',async(req,res)=>{
    const data=await Image.find();
    return res.json({"data":data});
      
})
app.post('/getImage',async(req,res)=>{
    const {id}=req.body;
    const data=await Image.findById(id);
    return res.json({"data":data});
      
})

app.post('/register',async(req,res)=>{  
    const email=req.body.email;
    const username=req.body.username;
    const password=req.body.password;
    const hash_password=await bcrypt.hash(password,10);
    const userSession=await req.session.user;
    if(userSession){
        return res.json({"message":"You already Logged In!","status":404,"user":userSession});
    }
    const user=await User.findOne({email:email});
    if(user){
        return res.json({"message":"Email Already Exists!"});
    }
    if(password.length<8){
        return res.json({"message":"Password must be 8 character long!"});
    }
    await User.create({username:username,email:email,password:hash_password});
    const newUser=await User.findOne({email:email});
    req.session.user=newUser;
    return res.json({"message":"User Created Sucessfully!","status":200,"user":newUser});
    
});

app.post('/login',async(req,res)=>{
    const email=req.body.email;
    const password=req.body.password;
    const userSession=await req.session.user;
    if(userSession){
        return res.json({"message":"You already Logged In!","status":404,"user":userSession});
    }
    console.log(userSession);
    const user=await User.findOne({email:email});
        if(!user){
            return res.json({"message":"User not exists!","status":404});
        }
    const match_Password=await bcrypt.compare(password,user.password);
    if(!match_Password){
        return res.json({"message":"Incorrect Password!","status":404});
    }
    req.session.user=user;
    //console.log(user);
    return res.json({"message":"User Logged In Sucessfully!","status":200,"user":user}); 
});


app.post('/logout',async(req,res)=>{
    if(await req.session.user==null){
        return res.json({"message":"You Already Logged In!"}); 
    }
    req.session.destroy((err) => {
        if (err) {
            res.json({"err":err}); 
        }
        // Session destroyed
        res.json({"message":"User Logged Out Sucessfully!","status":200}); 
      }); 
})

app.post('/uploadData',async(req,res)=>{
    

    const {url,title,desc}=req.body; 
    const image=await Image.findOne({title:title});
    if(image){
        return res.json({"message":"Image title already exists!","status":400});
    }
    await Image.create({title:title,desc:desc,url:url});
    return res.json({"message":"Image Created Sucessfully!","status":200});

});

app.post('/updateLike',async(req,res)=>{
    const {id,val}=req.body;
    try{
        await Image.findByIdAndUpdate(id,{likes:val+1});
        return res.json({"message":'you liked a image'});
    }
    catch(err){
        return res.json({"error":'error'});
    }
})

app.post('/updateView',async(req,res)=>{
    const {id,val}=req.body;
    try{
        await Image.findByIdAndUpdate(id,{viewed:val+1});
        return res.json({"message":'you viewed a image'});
    }
    catch(err){
        return res.json({"error":'error'});
    }
})

app.listen(5000,()=>{
    console.log("Listening to port number 5000");
});