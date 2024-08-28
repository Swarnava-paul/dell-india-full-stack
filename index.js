require('dotenv').config();
const cors = require('cors')
const express = require('express');
const AuthRouter = require('./routes/route.authentication')
const ServiceRouter = require('./routes/route.services')
const database = require('./config/connection.db')


const server = express(); // server express
const ProductModel = require('./models/model.Product')
server.use(cors({
    origin: ['http://localhost:4000', 'http://localhost:5173','https://dell-india.netlify.app/'],
    credentials: true,
  }));

// routes
server.use('/login',AuthRouter);
server.use('/service',ServiceRouter);

server.get('/serverHealthCheck',(req,res)=>{
res.end('Server is running ok')
})

server.listen(process.env.SERVER_RUNNING_PORT,()=>{
    try {
        console.log(`server is running on ${process.env.SERVER_RUNNING_PORT}`)
        database.connect;
    }catch(e) {
        console.log(`Server Error ${e}`);
        
    }
}    
)