const mongoose = require("mongoose")
const schema = mongoose.Schema(
    {
        "vazhipadname":{type:String,required:true},
        "price":{type:String,required:true}
        




       
    }
)
let vazhipadmodel = mongoose.model("vazhipad",schema)
module.exports={vazhipadmodel}

