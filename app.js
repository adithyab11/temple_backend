
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const express = require("express")
const jwt = require("jsonwebtoken")
const  cors = require("cors")
const { templeModel } = require("./models/user")
const { adminModel } = require("./models/admin")
const { vazhipadmodel }=require("./models/addvazhipad")

const app=express()
app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://Adithyab:8281041547@cluster0.uhvrb.mongodb.net/templeDB?retryWrites=true&w=majority&appName=Cluster0").then(console.log('connected'))
const generateHashedPassword = async(password) =>{
    const salt = await bcrypt.genSalt(10)  //salt=cost factor value
    return bcrypt.hash(password,salt)
}


app.post("/addvazhipad",(req,res)=>{

    let input=req.body
    let vazhipad=new vazhipadmodel(input)
    vazhipad.save()
    res.json({"status":"success"})
})


app.post("/signUp",async(req,res)=>{

    let input = req.body
    let hashedPassword = await generateHashedPassword(input.password)
    console.log(hashedPassword)

    input.password = hashedPassword     //stored the hashed password to server
    let user = new templeModel(input)
    user.save()
    console.log(user)
    res.json({"status":"success"})
})

app.post("/adminlogin", (req, res) => {
    let input = req.body;

    // Default admin credentials
    const adminEmail = 'admin@gmail.com';
    const adminPassword = 'admin123';

    // Check if the input matches admin credentials
    if (input.email === adminEmail && input.password === adminPassword) {
        // Admin login successful
        jwt.sign({ email: input.email }, "temple-app", { expiresIn: "1d" }, (error, token) => {
            if (error) {
                res.json({ "status": "Token credentials failed" });
            } else {
                res.json({ "status": "success", "token": token, "message": "Admin logged in successfully" });
            }
        });
    } else {
        // Check if the user exists in the database
        adminModel.find({ name: input.name }).then((response) => {
            if (response.length > 0) {
                const validator = bcrypt.compareSync(input.password, response[0].password);
                if (validator) {
                    // User login successful
                    jwt.sign({ email: input.email}, "elder-app", { expiresIn: "1d" }, (error, token) => {
                        if (error) {
                            res.json({ "status": "Token credentials failed" });
                        } else {
                            res.json({ "status": "success", "token": token });
                        }
                    });
                } else {
                    res.json({ "status": "Wrong password" });
                }
            } else {
                res.json({ "status": "Username doesn't exist" });
            }
        }).catch((err) => {
            res.json({ "status": "Error occurred", "error": err.message });
        });
    }
});


app.post("/signin",(req,res)=>{
    let input = req.body
    templeModel.find({"email":req.body.email}).then(
        (response)=>{
            if (response.length > 0) {
                let dbPassword = response[0].password  //entered email is compared with existing password(email)
                console.log(dbPassword)
                bcrypt.compare(input.password,dbPassword,(error,isMatch)=>{ //input pswd and hashed pswd is  compared
                    if (isMatch) {
                        //if login success generate token
                        jwt.sign({email:input.email},"temple-app",{expiresIn:"1d"},
                            (error,token)=>{
                                if (error) {
                                    res.json({"status":"unable to create token"})
                                } else {
                                    res.json({"status":"success","userId":response[0]._id,"token":token})
                                }
                            }
                        )
                    } else {
                        res.json({"status":"incorrect"})
                    }
                })
                
            } else {
                res.json({"status":"user not found"})
            }
        }
    ).catch()
})


app.listen(8080,()=>{
    console.log("server started")
})
