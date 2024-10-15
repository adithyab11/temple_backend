const mongoose = require("mongoose")
const adminschema = mongoose.Schema(
    {
       
        "email":{type:String,required:true},
        "password":{type:String,required:true},
        
    }
)
let adminModel = mongoose.model("admindata",adminschema)
module.exports={adminModel}

