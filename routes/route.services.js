// models
const CartModel = require('../models/model.Cart')
const ProductModel = require('../models/model.Product')
// modules
const express = require('express');
const ServiceRouter = express.Router();

// middlewares
const checkAuthentication = require('../middlewares/middleware.Authentication')

//nodecache
const Nodecache = require('node-cache');
const cacheProductData = new Nodecache();

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
    const {series,ram,storage,graphics,price,processor} = req.query;
    
    if(series) {
    if(series == 'G series') {
        const [gSeries] = series.split(" ")[0]
        const returnedValue = await hybridSearch("model",gSeries,'u');
        if(returnedValue.length > 0) {
            return res.status(200).json({message:"laptops",laptops:returnedValue})
        }
        return res.status(400).json({message:"No Laptops Found"})
    } // in case of g series this will run 
    const returnedValue = await hybridSearch("model",series);
    if(returnedValue.length > 0) {
        return res.status(200).json({message:"laptops",laptops:returnedValue})
    }
    return res.status(400).json({message:"No Laptops Found"})
    }else if (ram) {
    const ramValue = ram.split(" ")[0]
    const laptops = await hybridSearch("ram",ramValue);
    if(laptops.length > 0) {
        return res.status(200).json({message:"laptops",laptops})
    }
    return res.status(400).json({message:"No Laptops Found"})
    }else if (storage) {
        let storageValue = storage.split(" ")[0]
        if(storageValue == 1) {
         storageValue = `1TB`
        }
        
        const laptops = await hybridSearch("storage",storageValue);
        if(laptops.length > 0) {
            return res.status(200).json({message:"laptops",laptops})
        }
        return res.status(400).json({message:"No Laptops Found"})
    }else if (graphics) {
        const laptops = await hybridSearch("graphics",graphics);
        if(laptops.length > 0) {
            return res.status(200).json({message:"laptops",laptops})
        }
        return res.status(400).json({message:"No Laptops Found"})
    }else if (price) {

    }else if (processor) {

        const laptops = await hybridSearch("processor",processor);
        
        if(laptops.length > 0) {
            return res.status(200).json({message:"laptops",laptops})
        }
        return res.status(400).json({message:"No Laptops Found"})
    }
    }catch(error) {
     res.status(500).json({message:"Internal Server Error"});  
    }

})

ServiceRouter.get('/getCart',checkAuthentication,async(req,res)=>{
 
    try {
      const {id} = req.user;
      const cartProducts = await CartModel.find({userId:id});
      if(cartProducts.length > 0) {
        return res.status(200).json({message:"Products Found successful",products:cartProducts});
      }
      return res.status(400).json({message:"Please Add Products To carts",products:[]})
    }catch (error) {
        res.status(500).json({message:"Internal Server Error"})
    }
})
//without node cache avarage response time was initial 2.2s -> 500ms -> 400ms
// now with nodecache initial resp time was > 500 and minimal was 6ms
async function hybridSearch (key,value,searchSensitivity='i') {
    const concatedKey = key+value;
    let productData;
    if (cacheProductData.has(concatedKey)) {
        productData = cacheProductData.get(concatedKey)
    } else {
        const regex = new RegExp(value,searchSensitivity);
        productData = await ProductModel.find({[key]:{$regex:regex}});    
        cacheProductData.set(concatedKey,productData);
    }
    return productData;
}


module.exports = ServiceRouter;