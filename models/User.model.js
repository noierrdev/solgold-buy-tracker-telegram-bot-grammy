const mongoose=require('mongoose')
const schema=mongoose.Schema;

const UserSchema=new schema({
    telegramid:{
        type:Number
    }
},{
    timestamps:true
})

const User=mongoose.model('User',UserSchema);
module.exports=User;