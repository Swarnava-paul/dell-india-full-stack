const mongoose = require('mongoose');


const cartSchema = new mongoose.Schema({
userId:{type:String,required:true},
brand :{type:String,required:true},
model:{type:String,required:true},
processor:{type:String,required:true},
ram:{type:String,required:true},
storage:{type:String,required:true},
display:{type:String,required:true},
graphics:{type:String,required:true},
os:{type:String,required:true},
price:{type:Number,required:true},
release_year:{type:String,required:true},
imageUrl:{type:String,required:true}
},{versionKey:false});

const CartModel = mongoose.model('Cart',cartSchema);

module.exports = CartModel;