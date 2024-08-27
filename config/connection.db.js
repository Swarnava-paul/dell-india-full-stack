const mongoose = require('mongoose');

const database = {
  
   get connect(){

    (async function () {
     try{
      await mongoose.connect(process.env.MONGO_DB_URL)
      console.log('connection with Database Successful');
      
     } catch (e) {
       console.log(`connection with Database Failed ${e}`); 
       return new Error(`Connection With Database Failed ${e}`)
     }
    })()
 }

}

module.exports = database;