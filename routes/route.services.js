// models
const CartModel = require('../models/model.Cart')
const ProductModel = require('../models/model.Product')
// modules
const express = require('express');
const ServiceRouter = express.Router();

// middlewares
const checkAuthentication = require('../middlewares/middleware.Authentication')

ServiceRouter.use(express.json())

ServiceRouter.get('/',(req,res)=>{
    res.status(200).json({message:"Service Router Working Fine"})
})

ServiceRouter.post('/addCart',checkAuthentication,async(req,res)=>{

    try{
    const {id} = req.user;
    const product = req.body;
    delete product._id;
    await CartModel.create({...product,userId:id})
    res.status(201).json({message:"Product Added to Cart"})
    }catch(error) {
    res.status(500).json({message:"Internal Server Error"})
    }
})

ServiceRouter.get('/getProduct',async(req,res)=>{
 
    try{
     if(req.query.series) {
      const series = req.query.series;
      const regex = new RegExp(series,'i')
      const laptops = await ProductModel.find({model:{$regex:regex}})

      if(laptops.length > 0 || laptops) {
        return res.status(200).json({message:"Laptops Find Successful",laptops})
      }
      return res.status(400).json({message:"No Laptops Found"});
     }else {
        return res.status(400).json({message:"Laptop series is missing in query series"})
     } 

    }catch(error) {
     res.status(500).json({message:"Internal Server Error"})    
    }
})


module.exports = ServiceRouter;