const fs = require('node:fs')
const  path = require('path')
const logFilePath = path.join(__dirname,'access.log');

const logRequest = (req,res,next) => {
const time = new Date()
 const {url,method} = req;
 const reqTime = Date.now();

 next()

 const {statusCode} = res;
 const resTime = Date.now();
 const string = `\n \n \n \nrequest time was ${time} req method was
 ${method} req url ${url} res status ${statusCode} 
 time between req and res ${resTime-reqTime}`;
 fs.appendFile(logFilePath,string,'utf-8',(err)=>{
    console.log(err);
    
 })
}

module.exports = logRequest
