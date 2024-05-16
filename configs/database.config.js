const mongoose=require('mongoose')

module.exports=()=>{
    // Connect to MongoDB
    const MONGODB_URI=`mongodb+srv://noierrdev:noierrdev@vandermoleker.t28swgf.mongodb.net/?retryWrites=true&w=majority&appName=vandermoleker`;
    mongoose.connect(MONGODB_URI, {});
    
    const db = mongoose.connection;
    require('../models');
    /////////////////////
    // Handle MongoDB connection events
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    db.once('open', () => {
        console.log('Connected to MongoDB');
    });
}
